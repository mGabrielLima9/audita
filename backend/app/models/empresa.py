# backend/app/models/empresa.py

from sqlalchemy import Column, String, Integer, Date, Boolean
from app.core.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    cnpj = Column(String, unique=True, index=True, nullable=False) # CNPJ base sempre será obrigatório
    
    # --- ALTERAÇÃO AQUI ---
    razao_social = Column(String, nullable=True) 
    porte = Column(String(2), nullable=True)
    # --- FIM DA ALTERAÇÃO ---

    optante_simples = Column(Boolean, default=False)
    optante_mei = Column(Boolean, default=False)