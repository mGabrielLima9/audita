from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # O formato da URL de conexão para o PostgreSQL é:
    # postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
    DATABASE_URL: str

    class Config:
        # Este nome de arquivo é um padrão para guardar "segredos"
        env_file = ".env"

# Cria uma instância das configurações que será usada em todo o projeto
settings = Settings()