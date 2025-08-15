from sqlalchemy import Column, String, Integer, Date, Boolean, Numeric, ForeignKey 
from sqlalchemy.orm import relationship
from app.core.database import Base

class DeclaracaoPGDAS(Base):
    __tablename__ = "declaracoes_pgdas"

    id = Column(Integer, primary_key=True, index=True)
    
    # Relacionamento com a tabela de empresas
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    empresa = relationship("Empresa")
    
    competencia = Column(String(6), nullable=False, index=True) # Formato "YYYYMM"
    
    valor_declarado = Column(Numeric(15, 2))
    valor_iss_apurado = Column(Numeric(15, 2))
    
    # Outros campos úteis do arquivo PGDAS
    data_transmissao = Column(Date)
    retificadora = Column(Boolean, default=False)