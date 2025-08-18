# backend/app/api/endpoints/dashboard.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.services import dashboard_service
from app.schemas import dashboard_schema

router = APIRouter()

# Função para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{competencia}", response_model=dashboard_schema.DashboardData)
def read_dashboard_data(competencia: str, db: Session = Depends(get_db)):
    """
    Endpoint para buscar os dados consolidados do Dashboard para uma competência.
    Formato da competência: AAAAMM (ex: 202507)
    """
    dashboard_data = dashboard_service.get_dashboard_data(db=db, competencia=competencia)
    return dashboard_data

@router.get("/{competencia}/inadimplentes")
def read_inadimplentes_detalhadas(competencia: str, db: Session = Depends(get_db)):
    """
    Endpoint para buscar empresas inadimplentes detalhadas para uma competência.
    """
    inadimplentes = dashboard_service.get_inadimplencia_detalhada(db=db, competencia=competencia)
    return {"competencia": competencia, "inadimplentes": inadimplentes}

@router.get("/{competencia}/omissas")
def read_omissas_detalhadas(competencia: str, db: Session = Depends(get_db)):
    """
    Endpoint para buscar empresas omissas detalhadas para uma competência.
    """
    omissas = dashboard_service.get_omissao_detalhada(db=db, competencia=competencia)
    return {"competencia": competencia, "omissas": omissas}