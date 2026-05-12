from pydantic import BaseModel

class ItemExpedicaoCreate(BaseModel):
    fk_expedicao_id_expedicao: int
    fk_produto_codigo_barras: str
    quantidade_expedida: int
