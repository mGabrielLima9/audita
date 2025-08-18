# backend/scripts/importar_dados_mensais.py

import sys
import os
from pathlib import Path
import logging
from sqlalchemy.orm import Session
import zipfile
import io
from decimal import Decimal, InvalidOperation
from datetime import datetime

# --- Bloco de Configuração Essencial ---
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Nossos Módulos ---
from app.core.database import SessionLocal
from app.models.empresa import Empresa
from app.models.estabelecimento import Estabelecimento
from app.models.declaracao_pgdas import DeclaracaoPGDAS
from app.models.pagamento_daf import PagamentoDAF
from app.parsers.daf607_parser import parse_daf607_file

# --- CONFIGURAÇÃO DO SCRIPT ---
DADOS_SIMPLES_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/2_Simples_Nacional")
TARGET_ANO = "2025"
TARGET_MUNICIPIO_TOM = "0841"  # Código TOM de Morros
# --- FIM DA CONFIGURAÇÃO ---

def processar_bloco_declaracao(bloco_linhas: list, mapa_cnpj_id: dict, db: Session):
    """
    Recebe um bloco de linhas de UMA única declaração, extrai os dados
    e retorna um objeto DeclaracaoPGDAS se for válida, ou None.
    """
    if not bloco_linhas:
        return None
        
    registro_principal = bloco_linhas[0]
    
    try:
        # PRIMEIRA VERIFICAÇÃO: Verifica se tem campos suficientes
        if len(registro_principal) <= 14:
            return None
        
        # SEGUNDA VERIFICAÇÃO: Verifica se é de Morros (TOM = 0841)
        codigo_tom = registro_principal[8]  # Campo 8 = CODIGO_TOM
        if codigo_tom != TARGET_MUNICIPIO_TOM:
            return None  # Se não for de Morros, ignora toda a declaração
        
        # TERCEIRA VERIFICAÇÃO: Pega o CNPJ
        cnpj_completo = registro_principal[6]
        cnpj_base = cnpj_completo[:8]
        
        # QUARTA VERIFICAÇÃO: Verifica se está no nosso banco, se não, CRIA AUTOMATICAMENTE
        empresa_id = mapa_cnpj_id.get(cnpj_base)
        if not empresa_id:
            logging.info(f"Criando empresa de Morros automaticamente: CNPJ {cnpj_base}")
            
            # Converter data de abertura se disponível
            data_abertura = None
            if len(registro_principal) > 10 and len(registro_principal[10]) == 8:
                try:
                    data_str = registro_principal[10]
                    data_abertura = datetime.strptime(data_str, '%Y%m%d').date()
                except:
                    data_abertura = None
            
            # Criar empresa automaticamente
            nova_empresa = Empresa(
                cnpj=cnpj_base,
                razao_social=registro_principal[7] if len(registro_principal) > 7 else f"EMPRESA CNPJ {cnpj_base}",
                porte=None,  # Não disponível no PGDAS
                optante_simples=(registro_principal[9] == 'S') if len(registro_principal) > 9 else True,
                optante_mei=False  # Não disponível no PGDAS
            )
            db.add(nova_empresa)
            db.flush()  # Para obter o ID
            
            # Criar estabelecimento básico
            novo_estabelecimento = Estabelecimento(
                empresa_id=nova_empresa.id,
                cnpj_completo=cnpj_completo,
                data_inicio_atividade=data_abertura,
                # Outros campos ficam None
            )
            db.add(novo_estabelecimento)
            db.commit()
            
            empresa_id = nova_empresa.id
            mapa_cnpj_id[cnpj_base] = empresa_id
            logging.info(f"Empresa criada: {cnpj_base} - {nova_empresa.razao_social}")

        # QUINTA VERIFICAÇÃO: Processa os dados da declaração
        competencia = registro_principal[11]  # Campo 11 = COMPETENCIA
        if not (len(competencia) == 6 and competencia.isdigit()):
            logging.warning(f"Competência inválida para CNPJ {cnpj_completo}: '{competencia}'. Bloco ignorado.")
            return None

        # Extrair data e hora de transmissão (Campo 4: formato YYYYMMDDHHMMSS)
        data_transmissao = None
        if len(registro_principal) > 4 and len(registro_principal[4]) >= 8:
            try:
                data_hora_str = registro_principal[4]
                # Pega apenas a parte da data (primeiros 8 caracteres: YYYYMMDD)
                data_str = data_hora_str[:8]
                data_transmissao = datetime.strptime(data_str, '%Y%m%d').date()
            except:
                data_transmissao = None

        valor_declarado_str = registro_principal[12].replace(',', '.').strip()  # Campo 12 = RECEITA_BRUTA
        valor_declarado = Decimal(valor_declarado_str) if valor_declarado_str else Decimal('0.0')
        retificadora = (registro_principal[14] == 'R')  # Campo 14 = OPERACAO_RETIFICADORA
        
        iss_total = Decimal('0.0')
        # Itera sobre as linhas do mesmo bloco para somar o ISS
        for linha in bloco_linhas:
            # Garante que a linha é do tipo 03110 e tem colunas suficientes
            if len(linha) > 27 and linha[0] == '03110':
                valor_iss_str = linha[27].replace(',', '.').strip()
                if valor_iss_str:
                    iss_total += Decimal(valor_iss_str)
        
        return DeclaracaoPGDAS(
            empresa_id=empresa_id,
            competencia=competencia,
            valor_declarado=valor_declarado,
            valor_iss_apurado=iss_total,
            data_transmissao=data_transmissao,  # ✅ ADICIONADO!
            retificadora=retificadora
        )
    except (IndexError, InvalidOperation) as e:
        # Se qualquer parte da leitura do bloco falhar, ele será descartado
        cnpj_log = registro_principal[6] if len(registro_principal) > 6 else 'N/A'
        tom_log = registro_principal[8] if len(registro_principal) > 8 else 'N/A'
        logging.error(f"Erro ao processar CNPJ {cnpj_log}, TOM {tom_log}. Erro: {e}. Pulando.")
        return None

def carregar_dados_mensais(db: Session, ano: str):
    logging.info(f"Iniciando carga de dados mensais para o ano de: {ano}")
    logging.info(f"Filtrando apenas pelo município TOM: {TARGET_MUNICIPIO_TOM} (Morros)")
    logging.info("🚀 CADASTRO AUTOMÁTICO ATIVADO - Nenhuma empresa de Morros ficará de fora!")

    mapa_cnpj_id = {emp.cnpj: emp.id for emp in db.query(Empresa.id, Empresa.cnpj).all()}
    logging.info(f"CNPJs já existentes no banco: {len(mapa_cnpj_id)}")

    # --- PGDAS-D ---
    logging.info("--- Iniciando Processamento PGDAS-D ---")
    pgdas_path = DADOS_SIMPLES_PATH / ano / "PGDASD"
    declaracoes_para_processar = []
    
    total_registros_00000 = 0
    registros_morros = 0
    registros_processados = 0
    empresas_criadas = 0

    for pgdas_zip_file in pgdas_path.glob('*.zip'):
        logging.info(f"Lendo arquivo: {pgdas_zip_file.name}")
        with zipfile.ZipFile(pgdas_zip_file, 'r') as zf:
            txt_filename = zf.namelist()[0]
            with zf.open(txt_filename, 'r') as f:
                text_file = io.TextIOWrapper(f, encoding='latin1')
                
                bloco_atual = []
                for line in text_file:
                    fields = line.strip().split('|')
                    if fields and fields[0] == '00000':
                        total_registros_00000 += 1
                        
                        # Processa o bloco anterior antes de iniciar um novo
                        resultado = processar_bloco_declaracao(bloco_atual, mapa_cnpj_id, db)
                        if resultado: 
                            declaracoes_para_processar.append(resultado)
                            registros_processados += 1
                        
                        # Verifica se o novo registro é de Morros
                        if len(fields) > 8 and fields[8] == TARGET_MUNICIPIO_TOM:
                            registros_morros += 1
                        
                        # Inicia um novo bloco
                        bloco_atual = [fields]
                    elif fields and bloco_atual:
                        # Se não for um cabeçalho, apenas adiciona a linha ao bloco atual
                        bloco_atual.append(fields)
                
                # Garante que o último bloco do arquivo seja processado
                resultado = processar_bloco_declaracao(bloco_atual, mapa_cnpj_id, db)
                if resultado: 
                    declaracoes_para_processar.append(resultado)
                    registros_processados += 1

    # Contar quantas empresas foram criadas
    empresas_criadas = len(mapa_cnpj_id) - len({emp.cnpj: emp.id for emp in db.query(Empresa.id, Empresa.cnpj).all()})

    # Estatísticas de processamento
    logging.info(f"=== ESTATÍSTICAS DE PROCESSAMENTO ===")
    logging.info(f"Total de registros 00000 encontrados: {total_registros_00000}")
    logging.info(f"Registros de Morros (TOM {TARGET_MUNICIPIO_TOM}): {registros_morros}")
    logging.info(f"Registros efetivamente processados: {registros_processados}")
    logging.info(f"Empresas criadas automaticamente: {empresas_criadas}")
    logging.info(f"Declarações para inserir no banco: {len(declaracoes_para_processar)}")
    
    if registros_morros == registros_processados:
        logging.info("🎯 SUCESSO TOTAL: Todas as declarações de Morros foram processadas!")
    else:
        logging.warning(f"⚠️  {registros_morros - registros_processados} declarações de Morros não foram processadas")

    if declaracoes_para_processar:
        competencias_encontradas = {d.competencia for d in declaracoes_para_processar}
        logging.info(f"Limpando declarações existentes para as competências: {list(competencias_encontradas)}")
        db.query(DeclaracaoPGDAS).filter(DeclaracaoPGDAS.competencia.in_(competencias_encontradas)).delete(synchronize_session=False)
        db.commit()

        db.bulk_save_objects(declaracoes_para_processar)
        db.commit()
    logging.info(f"{len(declaracoes_para_processar)} registros de declaração inseridos.")

    # --- DAF607 ---
    logging.info("--- Iniciando Processamento DAF607 ---")
    daf_path = DADOS_SIMPLES_PATH / ano / "DAF607"
    pagamentos_data = []
    for daf_file in daf_path.glob('*'):
        if daf_file.is_file():
            pagamentos_data.extend(parse_daf607_file(str(daf_file)))

    pagamentos_para_inserir = []
    competencias_encontradas_daf = {pag['competencia'] for pag in pagamentos_data}

    if competencias_encontradas_daf:
        logging.info(f"Limpando pagamentos existentes para as competências: {list(competencias_encontradas_daf)}")
        db.query(PagamentoDAF).filter(PagamentoDAF.competencia.in_(competencias_encontradas_daf)).delete(synchronize_session=False)
        db.commit()
    
    for pag in pagamentos_data:
        cnpj_base = pag['cnpj'][:8]
        empresa_id = mapa_cnpj_id.get(cnpj_base)
        if empresa_id:
            pagamentos_para_inserir.append(PagamentoDAF(
                empresa_id=empresa_id, competencia=pag['competencia'],
                data_arrecadacao=pag['data_arrecadacao'], valor_principal_iss=pag['valor_principal_iss'],
                valor_multa_iss=pag['valor_multa_iss'], valor_juros_iss=pag['valor_juros_iss']
            ))
    
    db.bulk_save_objects(pagamentos_para_inserir)
    db.commit()
    logging.info(f"{len(pagamentos_para_inserir)} registros de pagamento inseridos.")
    
if __name__ == "__main__":
    db = SessionLocal()
    try:
        carregar_dados_mensais(db, TARGET_ANO)
        logging.info("🎉 Script de carga mensal finalizado com sucesso!")
    except Exception as e:
        logging.error(f"Ocorreu um erro geral no script: {e}", exc_info=True)
    finally:
        db.close()