# script_diagnostico_pgdas.py

import sys
import os
from pathlib import Path
import logging
import zipfile
import io

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

from app.core.database import SessionLocal
from app.models.empresa import Empresa

# Configuração
DADOS_SIMPLES_PATH = Path("C:/Users/admin/Desktop/Dados_Brutos_Auditor/2_Simples_Nacional")
TARGET_ANO = "2025"

def diagnosticar_estrutura_pgdas():
    """Diagnostica a estrutura dos arquivos PGDAS para identificar problemas"""
    
    # 1. Verificar empresas no banco
    db = SessionLocal()
    empresas_count = db.query(Empresa).count()
    logging.info(f"Empresas no banco: {empresas_count}")
    
    if empresas_count > 0:
        # Pegar amostra dos CNPJs
        amostras_cnpj = [emp.cnpj for emp in db.query(Empresa.cnpj).limit(5).all()]
        logging.info(f"Amostra de CNPJs no banco: {amostras_cnpj}")
    
    db.close()
    
    # 2. Investigar estrutura dos arquivos PGDAS
    pgdas_path = DADOS_SIMPLES_PATH / TARGET_ANO / "PGDASD"
    
    if not pgdas_path.exists():
        logging.error(f"Caminho não existe: {pgdas_path}")
        return
    
    arquivos_zip = list(pgdas_path.glob('*.zip'))
    logging.info(f"Arquivos ZIP encontrados: {len(arquivos_zip)}")
    
    if not arquivos_zip:
        logging.error("Nenhum arquivo ZIP encontrado!")
        return
    
    # Pegar o primeiro arquivo para análise
    primeiro_arquivo = arquivos_zip[0]
    logging.info(f"Analisando arquivo: {primeiro_arquivo.name}")
    
    try:
        with zipfile.ZipFile(primeiro_arquivo, 'r') as zf:
            txt_filename = zf.namelist()[0]
            logging.info(f"Arquivo TXT interno: {txt_filename}")
            
            with zf.open(txt_filename, 'r') as f:
                text_file = io.TextIOWrapper(f, encoding='latin1')
                
                total_linhas = 0
                registros_00000 = 0
                cnpjs_encontrados = set()
                amostras_linhas = []
                
                for i, line in enumerate(text_file):
                    total_linhas += 1
                    
                    # Guardar amostra das primeiras 10 linhas
                    if i < 10:
                        amostras_linhas.append(line.strip())
                    
                    # Testar diferentes separadores
                    fields_pipe = line.strip().split('|')
                    fields_semicolon = line.strip().split(';')
                    fields_tab = line.strip().split('\t')
                    
                    # Verificar qual separador faz mais sentido
                    if i == 0:
                        logging.info(f"Campos com '|': {len(fields_pipe)}")
                        logging.info(f"Campos com ';': {len(fields_semicolon)}")
                        logging.info(f"Campos com TAB: {len(fields_tab)}")
                    
                    # Usar o separador que parece mais provável (mais campos)
                    if len(fields_pipe) > len(fields_semicolon) and len(fields_pipe) > len(fields_tab):
                        fields = fields_pipe
                    elif len(fields_semicolon) > len(fields_tab):
                        fields = fields_semicolon
                    else:
                        fields = fields_tab
                    
                    # Verificar registros 00000
                    if fields and len(fields) > 0 and fields[0] == '00000':
                        registros_00000 += 1
                        
                        # Verificar se tem CNPJ na posição 6
                        if len(fields) > 6:
                            cnpj_candidato = fields[6]
                            if len(cnpj_candidato) >= 8:
                                cnpjs_encontrados.add(cnpj_candidato[:8])
                        
                        # Mostrar estrutura dos primeiros registros 00000
                        if registros_00000 <= 3:
                            logging.info(f"Registro 00000 #{registros_00000}:")
                            for idx, campo in enumerate(fields[:20]):  # Primeiros 20 campos
                                logging.info(f"  Campo {idx}: '{campo}'")
                    
                    # Parar após 1000 linhas para diagnóstico inicial
                    if i >= 1000:
                        break
                
                logging.info(f"=== RESUMO DIAGNÓSTICO ===")
                logging.info(f"Total de linhas analisadas: {total_linhas}")
                logging.info(f"Registros '00000' encontrados: {registros_00000}")
                logging.info(f"CNPJs únicos encontrados: {len(cnpjs_encontrados)}")
                logging.info(f"Amostra de CNPJs: {list(cnpjs_encontrados)[:5]}")
                
                logging.info(f"=== AMOSTRA DAS PRIMEIRAS LINHAS ===")
                for i, linha in enumerate(amostras_linhas):
                    logging.info(f"Linha {i}: {linha[:100]}...")  # Primeiros 100 caracteres
    
    except Exception as e:
        logging.error(f"Erro ao analisar arquivo: {e}", exc_info=True)

if __name__ == "__main__":
    diagnosticar_estrutura_pgdas()