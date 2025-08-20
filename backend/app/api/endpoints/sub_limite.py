from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.services import sub_limite_service
from app.schemas.sub_limite_schema import SubLimiteResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{competencia}", response_model=SubLimiteResponse)
def read_sub_limite(
    competencia: str,
    status: Optional[str] = Query(default=None, description="Filtrar por status"),
    db: Session = Depends(get_db),
):
    """
    Endpoint para listar empresas e seus RBT12, classificando por risco do SubLimite.
    - competencia no formato AAAAMM (ex: 202507)
    - status opcional: \"Extrapolou o limite\", \"Ultrapassando Sublimite\", \"Até 20% do Sublimite\"
    """
    return sub_limite_service.get_sub_limite(db=db, competencia=competencia, status=status)