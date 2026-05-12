from fastapi import APIRouter
from database import fetch_all

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])

@router.get("/vendas-por-vendedor")
def relatorio_vendas_por_vendedor():
    query = "SELECT * FROM TotalVendasPorVendedor"
    return fetch_all(query)

@router.get("/produtos-por-fornecedor")
def relatorio_produtos_por_fornecedor():
    query = "SELECT * FROM QuantidadeProdutoPorFornecedor"
    return fetch_all(query)
