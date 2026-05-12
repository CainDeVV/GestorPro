from pydantic import BaseModel

class ItemVendaCreate(BaseModel):
    fk_venda_id_venda: int
    fk_produto_codigo_barras: str
    quantidade_vendida: int
    preco_unitario_venda: float
