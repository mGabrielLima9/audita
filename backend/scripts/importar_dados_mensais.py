# backend/scripts/importar_dados_mensais.py

import sys
import os
from pathlib import Path
import logging
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

from app.core.database import SessionLocal, engine, Base
from app.models.empresa import Empresa
from app.models.declaracao_pgdas import DeclaracaoPGDAS
from app.models.pagamento_daf import PagamentoDAF
from app.parsers.pgdas_parser import parse_pgdasd_file
from app.parsers.daf607_parser import parse_daf607_file

# --- CONFIGURAÇÃO ---
DADOS_SIMPLES_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/2_Simples_Nacional")
TARGET_ANO = "2025"
TARGET_MES = "07"
# --- FIM DA CONFIGURAÇÃO ---

def carregar_dados_mensais(db: Session, ano: str, mes: str):
    competencia = f"{ano}{mes}"
    logging.info(f"Iniciando carga de dados mensais para a competência: {competencia}")

    logging.info("Mapeando CNPJs da tabela de empresas...")
    mapa_cnpj_id = {emp.cnpj: emp.id for emp in db.query(Empresa.id, Empresa.cnpj).all()}
    if not mapa_cnpj_id:
        logging.error("Nenhuma empresa encontrada no banco de dados. Execute o script 'importar_dados_abertos.py' primeiro.")
        return

    logging.info(f"Limpando dados existentes para a competência {competencia}...")
    db.query(DeclaracaoPGDAS).filter(DeclaracaoPGDAS.competencia == competencia).delete()
    db.query(PagamentoDAF).filter(PagamentoDAF.competencia == competencia).delete()
    db.commit()

    # --- PGDAS-D: Lendo TODOS os arquivos da pasta ---
    logging.info("Processando arquivos PGDAS-D...")
    pgdas_path = DADOS_SIMPLES_PATH / ano / "PGDASD"
    declaracoes_data = []
    for pgdas_file in pgdas_path.glob('*'): # Loop para ler todos os arquivos
        if pgdas_file.is_file():
            declaracoes_data.extend(parse_pgdasd_file(str(pgdas_file)))
    
    declaracoes_para_inserir = []
    for decl in declaracoes_data:
        # Filtra apenas pela competência que queremos
        if decl['competencia'] == competencia:
            empresa_id = mapa_cnpj_id.get(decl['cnpj'])
            if empresa_id:
                declaracoes_para_inserir.append(DeclaracaoPGDAS(
                    empresa_id=empresa_id, competencia=decl['competencia'],
                    valor_declarado=decl['valor_declarado'], valor_iss_apurado=decl['valor_iss_apurado'],
                    retificadora=decl['retificadora']
                ))
    
    db.bulk_save_objects(declaracoes_para_inserir)
    db.commit()
    logging.info(f"{len(declaracoes_para_inserir)} registros de declaração inseridos para a competência {competencia}.")

    # --- DAF607: Lendo TODOS os arquivos da pasta ---
    logging.info("Processando arquivos DAF607...")
    daf_path = DADOS_SIMPLES_PATH / ano / "DAF607"
    pagamentos_data = []
    for daf_file in daf_path.glob('*'): # Loop para ler todos os arquivos
        if daf_file.is_file():
            pagamentos_data.extend(parse_daf607_file(str(daf_file)))

    pagamentos_para_inserir = []
    for pag in pagamentos_data:
        # Filtra apenas pela competência que queremos
        if pag['competencia'] == competencia:
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
    logging.info(f"{len(pagamentos_para_inserir)} registros de pagamento inseridos para a competência {competencia}.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        carregar_dados_mensais(db, TARGET_ANO, TARGET_MES)
        logging.info("Script de carga mensal finalizado com sucesso!")
    except Exception as e:
        logging.error(f"Ocorreu um erro geral no script: {e}")
    finally:
        db.close()