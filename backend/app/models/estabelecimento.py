# backend/app/models/estabelecimento.py

from sqlalchemy import Column, String, Integer, ForeignKey, Date # Adicione 'Date' aqui
from sqlalchemy.orm import relationship
from app.core.database import Base

class Estabelecimento(Base):
    __tablename__ = "estabelecimentos"

    id = Column(Integer, primary_key=True, index=True)
    
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    empresa = relationship("Empresa")
    
    cnpj_completo = Column(String, unique=True, index=True)
    
    # Campos de Endereço
    logradouro = Column(String)
    numero = Column(String)
    bairro = Column(String)
    cep = Column(String(8))
    uf = Column(String(2))
    
    situacao_cadastral = Column(String(2))

    # --- NOVOS CAMPOS ADICIONADOS AQUI ---
    nome_fantasia = Column(String)
    data_inicio_atividade = Column(Date)