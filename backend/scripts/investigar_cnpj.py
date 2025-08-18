# backend/scripts/investigar_cnpj.py

import pandas as pd
import zipfile
from pathlib import Path
import logging
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

# --- CONFIGURAÇÃO ---
DADOS_ABERTOS_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/1_Dados_Abertos_CNPJ/2025-08")
TARGET_CNPJ_BASE = '48457194'
TARGET_CNPJ_ORDEM = '0001'
# --- FIM DA CONFIGURAÇÃO ---

def encontrar_cnpj_especifico():
    logging.info(f"Procurando pelo CNPJ base {TARGET_CNPJ_BASE} nos arquivos de Estabelecimentos...")
    
    estab_files = sorted([f for f in os.listdir(DADOS_ABERTOS_PATH) if 'ESTABELECIMENTOS' in str(f).upper() and str(f).endswith('.zip')])
    
    if not estab_files:
        logging.error("Nenhum arquivo .zip de Estabelecimento encontrado.")
        return

    encontrado = False
    for file_name in estab_files:
        if encontrado: break
        logging.info(f"Verificando arquivo: {file_name}...")
        try:
            with zipfile.ZipFile(DADOS_ABERTOS_PATH / file_name, 'r') as zf:
                csv_file_in_zip = zf.namelist()[0]
                with zf.open(csv_file_in_zip, 'r') as f:
                    chunk_iter = pd.read_csv(f, sep=';', header=None, dtype=str, encoding='latin1', chunksize=50000)
                    for chunk in chunk_iter:
                        # Filtra o chunk pelo CNPJ Base e Ordem
                        resultado = chunk[(chunk.iloc[:, 0] == TARGET_CNPJ_BASE) & (chunk.iloc[:, 1] == TARGET_CNPJ_ORDEM)]
                        if not resultado.empty:
                            logging.info(f"CNPJ ENCONTRADO! Detalhes do registro no arquivo:")
                            # Itera sobre cada coluna e imprime seu índice e valor
                            for i, col_value in enumerate(resultado.iloc[0]):
                                print(f"Coluna {i}: {col_value}")
                            encontrado = True
                            break # Para de processar chunks deste arquivo
        except Exception as e:
            logging.error(f"Erro ao processar o arquivo {file_name}: {e}")
    
    if not encontrado:
        logging.warning(f"O CNPJ base {TARGET_CNPJ_BASE} não foi encontrado em nenhum dos arquivos de Estabelecimentos.")

if __name__ == "__main__":
    encontrar_cnpj_especifico()