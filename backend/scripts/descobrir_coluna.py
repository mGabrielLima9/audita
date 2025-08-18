# backend/scripts/descobrir_coluna.py

import pandas as pd
import zipfile
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

# Ajuste este caminho se for diferente no seu computador
DADOS_ABERTOS_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/1_Dados_Abertos_CNPJ/2025-08")

ARQUIVO_AMOSTRA = "Estabelecimentos1.zip"

try:
    logging.info(f"Analisando a primeira linha do arquivo: {ARQUIVO_AMOSTRA}")
    with zipfile.ZipFile(DADOS_ABERTOS_PATH / ARQUIVO_AMOSTRA, 'r') as zf:
        csv_file_in_zip = zf.namelist()[0]
        with zf.open(csv_file_in_zip, 'r') as f:
            # Lê apenas a primeira linha de dados
            df_primeira_linha = pd.read_csv(
                f, sep=';', header=None, dtype=str,
                encoding='latin1', nrows=1 
            )

            logging.info("Conteúdo da primeira linha, dividido por colunas:")
            # Itera sobre cada coluna e imprime seu índice e valor
            for i, col_value in enumerate(df_primeira_linha.iloc[0]):
                print(f"Coluna {i}: {col_value}")

except Exception as e:
    logging.error(f"Ocorreu um erro: {e}")