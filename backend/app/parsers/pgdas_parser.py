# Leitor do arquivo PGDAS-D
# backend/app/parsers/pgdas_parser.py
import logging
from decimal import Decimal, InvalidOperation

# Configuração do logging para vermos mensagens de progresso ou erro
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def parse_pgdasd_file(file_path: str):
    """
    Lê um arquivo de declaração PGDAS-D e extrai as informações relevantes.
    O arquivo é pipe-delimited (|).
    """
    logging.info(f"Iniciando a leitura do arquivo PGDAS-D: {file_path}")
    
    declaracoes = []
    current_cnpj = None
    current_pa = None # Período de Apuração (AAAAMM)
    current_rpa = Decimal('0.0') # Receita Bruta do Período
    is_retificadora = False
    total_iss_apurado = Decimal('0.0')

    try:
        with open(file_path, 'r', encoding='latin1') as f:
            for line in f:
                fields = line.strip().split('|')
                record_type = fields[0] if fields else ''

                # Registro 00000 contém os dados gerais da declaração
                if record_type == '00000':
                    # Se já tivermos dados de uma declaração anterior, salva antes de começar a nova
                    if current_cnpj:
                        declaracoes.append({
                            "cnpj": current_cnpj,
                            "competencia": current_pa,
                            "valor_declarado": current_rpa,
                            "valor_iss_apurado": total_iss_apurado,
                            "retificadora": is_retificadora
                        })
                    
                    # Reinicia as variáveis para a nova declaração
                    current_cnpj = fields[7]  # CNPJ Matriz
                    current_pa = fields[12] # Período de Apuração
                    
                    # Tenta converter o valor da receita bruta, tratando possíveis erros
                    try:
                        current_rpa = Decimal(fields[13].replace(',', '.'))
                    except (InvalidOperation, IndexError):
                        current_rpa = Decimal('0.0')
                        logging.warning(f"Não foi possível ler a receita bruta para o CNPJ {current_cnpj} no período {current_pa}.")

                    is_retificadora = (fields[15] == 'R')
                    total_iss_apurado = Decimal('0.0')

                # Registro 03110 contém os valores detalhados dos tributos
                elif record_type == '03110':
                    try:
                        # O valor do ISS apurado está no campo de índice 27 (28ª posição)
                        valor_iss_do_registro = Decimal(fields[27].replace(',', '.'))
                        total_iss_apurado += valor_iss_do_registro
                    except (InvalidOperation, IndexError):
                        # Se não conseguir ler o valor, ignora e continua
                        pass

        # Adiciona a última declaração lida do arquivo
        if current_cnpj:
            declaracoes.append({
                "cnpj": current_cnpj,
                "competencia": current_pa,
                "valor_declarado": current_rpa,
                "valor_iss_apurado": total_iss_apurado,
                "retificadora": is_retificadora
            })

        logging.info(f"Leitura do arquivo {file_path} concluída. {len(declaracoes)} declarações encontradas.")
        return declaracoes

    except FileNotFoundError:
        logging.error(f"Arquivo não encontrado: {file_path}")
        return []
    except Exception as e:
        logging.error(f"Ocorreu um erro inesperado ao ler o arquivo: {e}")
        return []