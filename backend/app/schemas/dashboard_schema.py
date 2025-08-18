# backend/app/schemas/dashboard_schema.py

from pydantic import BaseModel
from typing import List, Optional

class DashboardData(BaseModel):
    """Schema para os dados principais do dashboard"""
    empresas_ativas: int  # Total de empresas ativas independente do porte
    empresas_optantes: int  # Empresas optantes do Simples Nacional
    empresas_declararam: int  # Empresas que declararam (encontradas no PGDAS)
    empresas_nao_declararam: int  # Empresas que não declararam (optantes não encontradas no PGDAS)
    empresas_inadimplentes: int  # Empresas que declararam mas não pagaram a guia DAS
    percentual_declararam: float  # Percentual de empresas que declararam sobre optantes
    percentual_inadimplentes: float  # Percentual de inadimplentes sobre quem declarou
    estabelecimentos_ativos: int  # Total de estabelecimentos ativos
    valor_declarado_total: float  # Valor total declarado (receita bruta)
    valor_iss_declarado: float  # Valor total de ISS declarado
    valor_iss_pago: float  # Valor total de ISS pago

class EmpresaInadimplente(BaseModel):
    """Schema para empresa inadimplente"""
    cnpj: str
    razao_social: Optional[str]
    valor_declarado: float
    valor_iss_apurado: float
    data_transmissao: Optional[str]

class EmpresaNaoDeclarou(BaseModel):
    """Schema para empresa que não declarou"""
    cnpj: str
    razao_social: Optional[str]

class DashboardCompleto(BaseModel):
    """Schema completo do dashboard com detalhamentos"""
    dados_gerais: DashboardData
    inadimplentes_detalhado: List[EmpresaInadimplente]
    nao_declararam_detalhado: List[EmpresaNaoDeclarou]
    competencia: str

class ResumoCompetencia(BaseModel):
    """Schema para resumo de uma competência específica"""
    competencia: str
    total_que_declararam: int
    total_arrecadado: float
    total_iss: float
    media_por_empresa: float