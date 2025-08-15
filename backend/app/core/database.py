from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings # Importa nossas configurações

# Cria o "motor" de conexão com o banco de dados
# O "engine" é o ponto central de comunicação com o banco.
engine = create_engine(settings.DATABASE_URL)

# Cria uma "fábrica de sessões" que usaremos para conversar com o banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Uma classe Base que nossos modelos (empresa.py, etc.) usarão para herdar
# as funcionalidades do SQLAlchemy.
Base = declarative_base()