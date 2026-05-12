from pydantic import BaseModel
from typing import Optional

class ProdutoCreate(BaseModel):
    codigo_barras: str
    nome: str
    quantidade: int = 0
    fk_fornecedor_cnpj: str
    lote: Optional[str] = None
    preco_venda: Optional[float] = None
    preco_custo: Optional[float] = None
    categoria: Optional[str] = None
    peso: Optional[float] = None
    descricao: Optional[str] = None

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    quantidade: Optional[int] = None
    lote: Optional[str] = None
    preco_venda: Optional[float] = None
    preco_custo: Optional[float] = None
    categoria: Optional[str] = None
    peso: Optional[float] = None
    descricao: Optional[str] = None
    fk_fornecedor_cnpj: Optional[str] = None
