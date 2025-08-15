from sqlalchemy import Column, String, Integer, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base 

class PagamentoDAF(Base):
    __tablename__ = "pagamentos_daf"

    id = Column(Integer, primary_key=True, index=True)
    
    # Relacionamento com a tabela de empresas
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    empresa = relationship("Empresa")
    
    competencia = Column(String(6), nullable=False, index=True) # Formato "YYYYMM"
    
    data_arrecadacao = Column(Date, nullable=False)
    
    valor_principal_iss = Column(Numeric(15, 2))
    valor_multa_iss = Column(Numeric(15, 2))
    valor_juros_iss = Column(Numeric(15, 2))