# backend/scripts/importar_dados_abertos.py

import pandas as pd
import os
from pathlib import Path
from sqlalchemy.orm import Session
import logging
import zipfile
import sys

# Adiciona a pasta 'backend' ao caminho de busca do Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

from app.core.database import SessionLocal, engine
from app.models.empresa import Empresa
from app.models.estabelecimento import Estabelecimento
from app.core.database import Base

# --- CONFIGURAÇÃO ---
DADOS_ABERTOS_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/1_Dados_Abertos_CNPJ/2025-08")
TARGET_MUNICIPIO_CODIGO = '0841'
# --- FIM DA CONFIGURAÇÃO ---

def carregar_dados_abertos(db: Session):
    logging.info(f"Iniciando carga de dados para o município {TARGET_MUNICIPIO_CODIGO}...")

    logging.info("Limpando tabelas existentes...")
    db.query(Estabelecimento).delete()
    db.query(Empresa).delete()
    db.commit()

    logging.info("Fase 1: Lendo arquivos de Estabelecimentos para encontrar CNPJs do município...")
    estab_files = sorted([f for f in os.listdir(DADOS_ABERTOS_PATH) if 'ESTABELECIMENTOS' in str(f).upper() and str(f).endswith('.zip')])
    
    lista_estabelecimentos_municipio = []
    for file_name in estab_files:
        logging.info(f"Processando {file_name}...")
        with zipfile.ZipFile(DADOS_ABERTOS_PATH / file_name, 'r') as zf:
            csv_file_in_zip = zf.namelist()[0]
            with zf.open(csv_file_in_zip, 'r') as f:
                chunk_iter = pd.read_csv(f, sep=';', header=None, dtype=str, encoding='latin1', chunksize=100000)
                for chunk in chunk_iter:
                    municipio_chunk = chunk[chunk.iloc[:, 20] == TARGET_MUNICIPIO_CODIGO]
                    if not municipio_chunk.empty:
                        lista_estabelecimentos_municipio.append(municipio_chunk)
    
    if not lista_estabelecimentos_municipio:
        logging.warning("Nenhum estabelecimento encontrado para o município. Encerrando.")
        return
        
    df_estabelecimentos_alvo = pd.concat(lista_estabelecimentos_municipio, ignore_index=True)
    # ATUALIZAÇÃO: Renomeando mais uma coluna que vamos usar (a de situação cadastral)
    df_estabelecimentos_alvo = df_estabelecimentos_alvo.rename(columns={
        0: 'CNPJ_BASICO', 1: 'CNPJ_ORDEM', 2: 'CNPJ_DV', 5: 'SITUACAO_CADASTRAL',
        14: 'LOGRADOURO', 15: 'NUMERO', 17: 'BAIRRO', 18: 'CEP', 19: 'UF'
    })
    cnpjs_base_alvo = df_estabelecimentos_alvo['CNPJ_BASICO'].unique().tolist()
    logging.info(f"Fase 1 concluída: {len(df_estabelecimentos_alvo)} estabelecimentos e {len(cnpjs_base_alvo)} empresas únicas encontradas.")

    logging.info("Fase 2: Lendo arquivos de Empresas e Simples...")
    def read_zip_files_to_dataframe(pattern: str, col_names: list, use_cnpj_filter: list):
        dfs = []
        zip_files = sorted([f for f in os.listdir(DADOS_ABERTOS_PATH) if pattern in str(f).upper() and str(f).endswith('.zip')])
        for file_name in zip_files:
            with zipfile.ZipFile(DADOS_ABERTOS_PATH / file_name, 'r') as zf:
                csv_file_in_zip = zf.namelist()[0]
                with zf.open(csv_file_in_zip, 'r') as f:
                    chunk_iter = pd.read_csv(f, sep=';', header=None, names=col_names, dtype=str, encoding='latin1', chunksize=100000)
                    for chunk in chunk_iter:
                        filtered_chunk = chunk[chunk['CNPJ_BASICO'].isin(use_cnpj_filter)]
                        if not filtered_chunk.empty:
                            dfs.append(filtered_chunk)
        if not dfs: return pd.DataFrame(columns=col_names)
        return pd.concat(dfs, ignore_index=True)

    col_names_emp = ['CNPJ_BASICO', 'RAZAO_SOCIAL', 'NATUREZA_JURIDICA', 'QUALIF_RESP', 'CAPITAL_SOCIAL', 'PORTE_EMPRESA', 'ENTE_FEDERATIVO']
    df_empresas = read_zip_files_to_dataframe('EMPRESAS', col_names_emp, cnpjs_base_alvo)
    
    col_names_simples = ['CNPJ_BASICO', 'OPCAO_PELO_SIMPLES', 'DATA_OPCAO_SIMPLES', 'DATA_EXCLUSAO_SIMPLES', 'OPCAO_PELO_MEI', 'DATA_OPCAO_MEI', 'DATA_EXCLUSAO_MEI']
    df_simples = read_zip_files_to_dataframe('SIMPLES', col_names_simples, cnpjs_base_alvo)

    logging.info("Fase 3: Inserindo dados na tabela 'empresas'...")
    empresas_para_inserir = []
    for index, row in df_empresas.iterrows():
        simples_info = df_simples[df_simples['CNPJ_BASICO'] == row['CNPJ_BASICO']].iloc[0] if not df_simples[df_simples['CNPJ_BASICO'] == row['CNPJ_BASICO']].empty else None
        empresas_para_inserir.append(Empresa(
            cnpj=row['CNPJ_BASICO'],
            razao_social=row['RAZAO_SOCIAL'],
            porte=row['PORTE_EMPRESA'],
            optante_simples=simples_info['OPCAO_PELO_SIMPLES'] == 'S' if simples_info is not None else False,
            optante_mei=simples_info['OPCAO_PELO_MEI'] == 'S' if simples_info is not None else False
        ))
    db.bulk_save_objects(empresas_para_inserir)
    db.commit()
    logging.info(f"{len(empresas_para_inserir)} registros inseridos na tabela 'empresas'.")

    logging.info("Fase 4: Inserindo dados na tabela 'estabelecimentos'...")
    mapa_cnpj_id = {emp.cnpj: emp.id for emp in db.query(Empresa.id, Empresa.cnpj).all()}
    
    estabelecimentos_para_inserir = []
    for index, row in df_estabelecimentos_alvo.iterrows():
        empresa_id = mapa_cnpj_id.get(row['CNPJ_BASICO'])
        if empresa_id:
            estabelecimentos_para_inserir.append(Estabelecimento(
                empresa_id=empresa_id,
                cnpj_completo=f"{row['CNPJ_BASICO']}{row['CNPJ_ORDEM']}{row['CNPJ_DV']}",
                logradouro=row['LOGRADOURO'],
                numero=row['NUMERO'],
                bairro=row['BAIRRO'],
                cep=row['CEP'],
                uf=row['UF'],
                # ATUALIZAÇÃO: Adicionando o novo campo
                situacao_cadastral=row['SITUACAO_CADASTRAL']
            ))
    
    db.bulk_save_objects(estabelecimentos_para_inserir)
    db.commit()
    logging.info(f"{len(estabelecimentos_para_inserir)} registros inseridos na tabela 'estabelecimentos'.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        carregar_dados_abertos(db)
        logging.info("Script de carga finalizado com sucesso!")
    except Exception as e:
        logging.error(f"Ocorreu um erro geral no script: {e}")
    finally:
        db.close()