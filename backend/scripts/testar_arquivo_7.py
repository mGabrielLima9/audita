# backend/scripts/testar_arquivo_7.py

import pandas as pd
import zipfile
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

# --- CONFIGURAÇÃO ---
DADOS_ABERTOS_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/1_Dados_Abertos_CNPJ/2025-08")
ARQUIVO_TESTE = "Estabelecimentos7.zip"
TARGET_MUNICIPIO_CODIGO = '0841'
# --- FIM DA CONFIGURAÇÃO ---

def testar_arquivo_especifico():
    logging.info(f"Iniciando teste focado no arquivo: {ARQUIVO_TESTE}")
    logging.info(f"Procurando por estabelecimentos com o código de município: {TARGET_MUNICIPIO_CODIGO}")
    
    caminho_completo = DADOS_ABERTOS_PATH / ARQUIVO_TESTE
    resultados_encontrados = []
    total_linhas_encontradas = 0

    try:
        with zipfile.ZipFile(caminho_completo, 'r') as zf:
            csv_file_in_zip = zf.namelist()[0]
            with zf.open(csv_file_in_zip, 'r') as f:
                chunk_iter = pd.read_csv(f, sep=';', header=None, dtype=str, encoding='latin1', chunksize=50000)
                
                for chunk in chunk_iter:
                    # Garante que a coluna 20 não tenha valores nulos e remove espaços
                    chunk.iloc[:, 20] = chunk.iloc[:, 20].fillna('').str.strip()
                    
                    # Filtra o chunk pelo código do município
                    municipio_chunk = chunk[chunk.iloc[:, 20] == TARGET_MUNICIPIO_CODIGO]
                    
                    if not municipio_chunk.empty:
                        total_linhas_encontradas += len(municipio_chunk)
                        # Guarda as 5 primeiras linhas encontradas para amostragem
                        if len(resultados_encontrados) < 5:
                            resultados_encontrados.append(municipio_chunk)

    except Exception as e:
        logging.error(f"Ocorreu um erro ao processar o arquivo: {e}")
        return

    if total_linhas_encontradas > 0:
        logging.info(f"SUCESSO! Encontrado um total de {total_linhas_encontradas} estabelecimentos de Morros no arquivo {ARQUIVO_TESTE}.")
        logging.info("Amostra dos 5 primeiros registros encontrados:")
        df_amostra = pd.concat(resultados_encontrados, ignore_index=True).head(5)
        print(df_amostra[[0, 1, 2, 4, 14, 20]]) # Mostra CNPJ, Fantasia, Logradouro e o Cód. Município
    else:
        logging.warning(f"FALHA. Nenhum estabelecimento de Morros foi encontrado no arquivo {ARQUIVO_TESTE}.")


if __name__ == "__main__":
    testar_arquivo_especifico()