from sqlalchemy import Column, String, Integer, Date, Boolean 
from app.core.database import Base


class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    cnpj = Column(String, unique=True, index=True, nullable=False)
    razao_social = Column(String, nullable=False)
    
    # 01 = ME, 03 = EPP, 05 = Demais
    porte = Column(String(2)) 
    
    optante_simples = Column(Boolean, default=False)
    optante_mei = Column(Boolean, default=False)
    
    # Adicionaremos mais campos como endereço, etc., depois.