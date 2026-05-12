from fastapi import APIRouter
from database import fetch_all

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])

@router.get("/total_vendas_por_vendedor")
def total_vendas_por_vendedor():
    """
    Retorna o total vendido por cada vendedor.
    """
    dados = fetch_all("SELECT * FROM TotalVendasPorVendedor")
    return {"resultado": dados}

@router.get("/quantidade_produto_por_fornecedor")
def quantidade_produto_por_fornecedor():
    """
    Retorna a quantidade total de produtos por fornecedor.
    """
    dados = fetch_all("SELECT * FROM QuantidadeProdutoPorFornecedor")
    return {"resultado": dados}
