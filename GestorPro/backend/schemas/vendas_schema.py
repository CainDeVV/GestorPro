from pydantic import BaseModel
from typing import Optional, List

class ItemVendaCreate(BaseModel):
    fk_produto_codigo_barras: str
    quantidade_vendida: int
    preco_unitario_venda: float

class VendaCreate(BaseModel):
    fk_rota_id_rota: int
    fk_vendedor_cpf: str
    fk_cliente_id_cliente: Optional[int] = None
    apelido_venda: Optional[str] = None  # Adicionar esta propriedade
    itens: List[ItemVendaCreate]

class VendaUpdate(BaseModel):
    fk_rota_id_rota: Optional[int] = None
    fk_cliente_id_cliente: Optional[int] = None
    status_venda: Optional[str] = None
    apelido_venda: Optional[str] = None  # Adicionar esta propriedade
