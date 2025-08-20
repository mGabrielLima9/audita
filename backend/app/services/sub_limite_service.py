from datetime import datetime
from dateutil.relativedelta import relativedelta
from typing import List, Optional, Dict, Any

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.empresa import Empresa
from app.models.estabelecimento import Estabelecimento
from app.models.declaracao_pgdas import DeclaracaoPGDAS

LIMITE_SIMPLES = 4_800_000.00
SUBLIMITE = 3_600_000.00

STATUS_EXTRAPOLOU_LIMITE = "Extrapolou o limite"
STATUS_ULTRAPASSANDO_SUBLIMITE = "Ultrapassando Sublimite"
STATUS_ATE_20_PORCENTO = "Até 20% do Sublimite"

def _gerar_ultimos_12_meses(competencia: str) -> List[str]:
    # competencia formato YYYYMM
    base = datetime.strptime(competencia, "%Y%m")
    meses = []
    for i in range(12):
        d = base - relativedelta(months=i)
        meses.append(d.strftime("%Y%m"))
    return meses

def _classificar_status(rbt12: float) -> str:
    if rbt12 >= LIMITE_SIMPLES:
        return STATUS_EXTRAPOLOU_LIMITE
    if rbt12 >= SUBLIMITE:
        return STATUS_ULTRAPASSANDO_SUBLIMITE
    if rbt12 >= (0.8 * SUBLIMITE):
        return STATUS_ATE_20_PORCENTO
    return ""  # Sem risco

def _percentual_extrapolado(rbt12: float) -> float:
    if rbt12 <= SUBLIMITE:
        return 0.0
    return round(((rbt12 - SUBLIMITE) / SUBLIMITE) * 100.0, 2)

def get_sub_limite(db: Session, competencia: str, status: Optional[str] = None) -> Dict[str, Any]:
    competencias_12 = _gerar_ultimos_12_meses(competencia)

    # Subquery com soma dos últimos 12 meses por empresa
    sub_sum = (
        db.query(
            DeclaracaoPGDAS.empresa_id.label("empresa_id"),
            func.coalesce(func.sum(DeclaracaoPGDAS.valor_declarado), 0).label("rbt12"),
        )
        .filter(DeclaracaoPGDAS.competencia.in_(competencias_12))
        .group_by(DeclaracaoPGDAS.empresa_id)
        .subquery()
    )

    # Query principal com CNPJ completo do estabelecimento
    rows = (
        db.query(
            Empresa.id.label("empresa_id"),
            Estabelecimento.cnpj_completo.label("cnpj_completo"),  # CNPJ completo
            Empresa.razao_social,
            func.min(Estabelecimento.data_inicio_atividade).label("inicio_atividade"),
            func.coalesce(sub_sum.c.rbt12, 0.0).label("rbt12"),
        )
        .join(Estabelecimento, Estabelecimento.empresa_id == Empresa.id)  # INNER JOIN
        .join(sub_sum, sub_sum.c.empresa_id == Empresa.id)  # INNER JOIN para garantir que existe RBT12
        .filter(Empresa.optante_simples == True)
        .filter(sub_sum.c.rbt12 > 0)  # FILTRO: apenas RBT12 > 0
        .group_by(Empresa.id, Estabelecimento.cnpj_completo, Empresa.razao_social, sub_sum.c.rbt12)
        .all()
    )

    itens = []
    for r in rows:
        rbt12 = float(r.rbt12 or 0.0)
        st = _classificar_status(rbt12)
        item = {
            "cnpj": r.cnpj_completo,  # Agora retorna CNPJ completo
            "razao_social": r.razao_social,
            "inicio_atividade": r.inicio_atividade.isoformat() if r.inicio_atividade else None,
            "entrada_sn": None,  # campo ainda não disponível no modelo atual
            "rbt12": rbt12,
            "percentual_extrapolado": _percentual_extrapolado(rbt12),
            "status": st,
        }
        itens.append(item)

    if status:
        itens = [i for i in itens if i["status"] == status]

    # Ordena por maior RBT12 primeiro
    itens.sort(key=lambda x: x["rbt12"], reverse=True)

    return {
        "competencia": competencia,
        "limite_simples": LIMITE_SIMPLES,
        "sublimite": SUBLIMITE,
        "total": len(itens),
        "itens": itens,
    }