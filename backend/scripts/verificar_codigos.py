# backend/scripts/verificar_codigos.py

import pandas as pd
import zipfile
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

# Ajuste este caminho se for diferente no seu computador
DADOS_ABERTOS_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/1_Dados_Abertos_CNPJ/2025-08")

# ALTERAÇÃO: Agora vamos "espiar" o segundo arquivo da lista
ARQUIVO_AMOSTRA = "Estabelecimentos1.zip"

col_names_estab = ['CNPJ_BASICO', 'CNPJ_ORDEM', 'CNPJ_DV', 'IDENTIFICADOR_MATRIZ_FILIAL', 'NOME_FANTASIA', 
                   'SITUACAO_CADASTRAL', 'DATA_SITUACAO_CADASTRAL', 'MOTIVO_SITUACAO_CADASTRAL', 'NOME_CIDADE_EXTERIOR', 
                   'PAIS', 'DATA_INICIO_ATIVIDADE', 'CNAE_FISCAL_PRINCIPAL', 'CNAE_FISCAL_SECUNDARIA', 'TIPO_LOGRADOURO', 
                   'LOGRADOURO', 'NUMERO', 'COMPLEMENTO', 'BAIRRO', 'CEP', 'UF', 'MUNICIPIO']

try:
    logging.info(f"Analisando o arquivo de amostra: {ARQUIVO_AMOSTRA}")
    with zipfile.ZipFile(DADOS_ABERTOS_PATH / ARQUIVO_AMOSTRA, 'r') as zf:
        csv_file_in_zip = zf.namelist()[0]
        with zf.open(csv_file_in_zip, 'r') as f:
            # Lê apenas uma amostra para ser rápido
            df_sample = pd.read_csv(
                f, sep=';', header=None, names=col_names_estab, dtype=str,
                encoding='latin1', nrows=50000 
            )
            
            # Pega todos os valores únicos da coluna 'MUNICIPIO'
            codigos_encontrados = df_sample['MUNICIPIO'].unique()
            
            logging.info("Amostra de códigos de município encontrados no arquivo:")
            print(codigos_encontrados)

            # Verifica se nosso código alvo está na amostra
            if '2107100' in codigos_encontrados:
                logging.info("\nBOA NOTÍCIA: O código de Morros (2107100) FOI encontrado na amostra!")
            else:
                logging.warning("\nATENÇÃO: O código de Morros (2107100) NÃO foi encontrado na amostra.")

except Exception as e:
    logging.error(f"Ocorreu um erro: {e}")