from pydantic import BaseModel
from typing import List, Optional

class SubLimiteItem(BaseModel):
    cnpj: str
    razao_social: Optional[str]
    inicio_atividade: Optional[str]
    entrada_sn: Optional[str]
    rbt12: float
    percentual_extrapolado: float
    status: str

class SubLimiteResponse(BaseModel):
    competencia: str
    limite_simples: float
    sublimite: float
    total: int
    itens: List[SubLimiteItem]