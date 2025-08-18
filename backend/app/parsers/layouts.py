# backend/app/parsers/layouts.py

# Define a posição (índice) de cada campo que nos interessa
# para o registro '00000' do arquivo PGDAS-D
LAYOUT_PGDASD_00000 = {
    'TIPO_REGISTRO': 0,
    'CNPJ_MATRIZ': 6,
    'RAZAO_SOCIAL': 7,
    'CODIGO_TOM': 8,
    'OPTANTE_SIMPLES': 9,
    'DATA_ABERTURA': 10,
    'COMPETENCIA': 12,
    'RECEITA_BRUTA': 13,
    'OPERACAO_RETIFICADORA': 15,
}

# Faremos o mesmo para outros registros e arquivos no futuro
# LAYOUT_PGDASD_03110 = { ... }
# LAYOUT_DAF607 = { ... }