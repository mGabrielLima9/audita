# backend/app/services/dashboard_service.py

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.empresa import Empresa
from app.models.estabelecimento import Estabelecimento
from app.models.declaracao_pgdas import DeclaracaoPGDAS
from app.models.pagamento_daf import PagamentoDAF

def get_dashboard_data(db: Session, competencia: str):
    """
    Consulta o banco de dados e calcula os KPIs para o dashboard para uma dada competência.
    LÓGICA SIMPLIFICADA: Inadimplente = Declarou mas não pagou a guia DAS
    """
    # KPI: Total de Empresas Ativas
    empresas_ativas = db.query(func.count(Empresa.id.distinct())) \
                        .join(Estabelecimento, Empresa.id == Estabelecimento.empresa_id) \
                        .filter(Estabelecimento.situacao_cadastral == '02') \
                        .scalar()

    # KPI: Empresas Optantes do Simples Nacional
    empresas_optantes = db.query(func.count(Empresa.id)).filter(Empresa.optante_simples == True).scalar()
    
    # KPI: Empresas que Declararam na competência
    empresas_declararam = db.query(func.count(DeclaracaoPGDAS.empresa_id.distinct())) \
                           .filter(DeclaracaoPGDAS.competencia == competencia).scalar()

    # KPI: Empresas que Não Declararam
    empresas_nao_declararam = empresas_optantes - empresas_declararam

    # LÓGICA SIMPLIFICADA PARA INADIMPLENTES
    # Inadimplentes = Declararam mas não pagaram a guia DAS (não aparecem no DAF607)
    
    # 1. Empresas que declararam na competência
    empresas_que_declararam = db.query(DeclaracaoPGDAS.empresa_id.distinct()) \
                                .filter(DeclaracaoPGDAS.competencia == competencia)

    # 2. Empresas que pagaram (aparecem no DAF607)
    empresas_que_pagaram = db.query(PagamentoDAF.empresa_id.distinct()) \
                             .filter(PagamentoDAF.competencia == competencia)

    # 3. Inadimplentes = Declararam mas não pagaram
    empresas_inadimplentes = empresas_que_declararam.except_(empresas_que_pagaram).count()
    
    # KPI: Percentuais
    percentual_declararam = (empresas_declararam / empresas_optantes * 100) if empresas_optantes > 0 else 0
    percentual_inadimplentes = (empresas_inadimplentes / empresas_declararam * 100) if empresas_declararam > 0 else 0

    # KPI: Total de Estabelecimentos Ativos
    estabelecimentos_ativos = db.query(func.count(Estabelecimento.id)) \
                                .filter(Estabelecimento.situacao_cadastral == '02').scalar()

    # KPI: Valores financeiros
    valor_iss_declarado = db.query(func.coalesce(func.sum(DeclaracaoPGDAS.valor_iss_apurado), 0)) \
                            .filter(DeclaracaoPGDAS.competencia == competencia).scalar()

    valor_iss_pago = db.query(func.coalesce(func.sum(PagamentoDAF.valor_principal_iss), 0)) \
                       .filter(PagamentoDAF.competencia == competencia).scalar()

    valor_declarado_total = db.query(func.coalesce(func.sum(DeclaracaoPGDAS.valor_declarado), 0)) \
                              .filter(DeclaracaoPGDAS.competencia == competencia).scalar()

    return {
        "empresas_ativas": empresas_ativas,
        "empresas_optantes": empresas_optantes,
        "empresas_declararam": empresas_declararam,
        "empresas_nao_declararam": empresas_nao_declararam,
        "empresas_inadimplentes": empresas_inadimplentes,
        "percentual_declararam": round(percentual_declararam, 2),
        "percentual_inadimplentes": round(percentual_inadimplentes, 2),
        "estabelecimentos_ativos": estabelecimentos_ativos,
        "valor_declarado_total": float(valor_declarado_total),
        "valor_iss_declarado": float(valor_iss_declarado),
        "valor_iss_pago": float(valor_iss_pago)
    }

def get_inadimplencia_detalhada(db: Session, competencia: str):
    """
    Retorna lista detalhada de empresas inadimplentes para uma competência.
    Inadimplentes = Empresas que declararam mas não pagaram a guia DAS
    """
    # Subquery: Empresas que declararam na competência
    declararam = db.query(DeclaracaoPGDAS.empresa_id.distinct()) \
                   .filter(DeclaracaoPGDAS.competencia == competencia).subquery()
    
    # Subquery: Empresas que pagaram na competência
    pagaram = db.query(PagamentoDAF.empresa_id.distinct()) \
                .filter(PagamentoDAF.competencia == competencia).subquery()
    
    # Query: Empresas inadimplentes (declararam mas não pagaram)
    inadimplentes = db.query(
        Empresa.cnpj,
        Empresa.razao_social,
        DeclaracaoPGDAS.valor_declarado,
        DeclaracaoPGDAS.valor_iss_apurado,
        DeclaracaoPGDAS.data_transmissao
    ).join(DeclaracaoPGDAS, Empresa.id == DeclaracaoPGDAS.empresa_id) \
     .filter(DeclaracaoPGDAS.competencia == competencia) \
     .filter(Empresa.id.in_(declararam)) \
     .filter(~Empresa.id.in_(pagaram)) \
     .all()
    
    return [
        {
            "cnpj": emp.cnpj,
            "razao_social": emp.razao_social,
            "valor_declarado": float(emp.valor_declarado) if emp.valor_declarado else 0.0,
            "valor_iss_apurado": float(emp.valor_iss_apurado) if emp.valor_iss_apurado else 0.0,
            "data_transmissao": emp.data_transmissao.isoformat() if emp.data_transmissao else None
        }
        for emp in inadimplentes
    ]

def get_omissao_detalhada(db: Session, competencia: str):
    """
    Retorna lista detalhada de empresas que não declararam para uma competência.
    """
    # Subquery: Empresas que declararam na competência
    declararam = db.query(DeclaracaoPGDAS.empresa_id.distinct()) \
                   .filter(DeclaracaoPGDAS.competencia == competencia).subquery()
    
    # Query: Empresas optantes ativas que não declararam
    nao_declararam = db.query(
        Empresa.cnpj,
        Empresa.razao_social
    ).join(Estabelecimento, Empresa.id == Estabelecimento.empresa_id) \
     .filter(Empresa.optante_simples == True) \
     .filter(Estabelecimento.situacao_cadastral == '02') \
     .filter(~Empresa.id.in_(declararam)) \
     .all()
    
    return [
        {
            "cnpj": emp.cnpj,
            "razao_social": emp.razao_social
        }
        for emp in nao_declararam
    ]