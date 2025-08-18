# Leitor do arquivo DAF607
# backend/app/parsers/daf607_parser.py

import logging
from decimal import Decimal, InvalidOperation
from datetime import datetime

# Configuração do logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def parse_daf607_file(file_path: str):
    """
    Lê um arquivo de pagamento DAF607 (formato de largura fixa) e extrai as informações.
    """
    logging.info(f"Iniciando a leitura do arquivo DAF607: {file_path}")
    
    pagamentos = []

    try:
        with open(file_path, 'r', encoding='latin1') as f:
            for line in f:
                # O registro de detalhe do pagamento começa com o caractere '2'
                if not line.startswith('2'):
                    continue

                try:
                    # Fatiando a linha com base no layout de largura fixa
                    # As posições são baseadas em índice 0 (início, fim-1)
                    cnpj = line[74:88].strip()
                    data_arrecadacao_str = line[9:17].strip()
                    competencia = line[100:106].strip()
                    
                    # O valor vem como uma string de inteiros (ex: '0000000000014281')
                    # Precisamos converter para Decimal (ex: 142.81)
                    valor_principal_str = line[106:123]
                    valor_multa_str = line[123:140]
                    valor_juros_str = line[140:157]

                    # Converte os valores para Decimal
                    valor_principal = Decimal(valor_principal_str) / 100
                    valor_multa = Decimal(valor_multa_str) / 100
                    valor_juros = Decimal(valor_juros_str) / 100

                    # Converte a data de string para objeto date
                    data_arrecadacao = datetime.strptime(data_arrecadacao_str, '%Y%m%d').date()

                    # Adiciona os dados extraídos à nossa lista
                    pagamentos.append({
                        "cnpj": cnpj,
                        "competencia": competencia,
                        "data_arrecadacao": data_arrecadacao,
                        "valor_principal_iss": valor_principal,
                        "valor_multa_iss": valor_multa,
                        "valor_juros_iss": valor_juros,
                    })

                except (ValueError, IndexError, InvalidOperation) as e:
                    logging.warning(f"Não foi possível ler uma linha do arquivo DAF607. Linha pulada. Erro: {e}")

        logging.info(f"Leitura do arquivo {file_path} concluída. {len(pagamentos)} registros de pagamento encontrados.")
        return pagamentos

    except FileNotFoundError:
        logging.error(f"Arquivo não encontrado: {file_path}")
        return []
    except Exception as e:
        logging.error(f"Ocorreu um erro inesperado ao ler o arquivo: {e}")
        return []