from pydantic import BaseModel
from typing import Optional

class MovimentacaoFinanceira(BaseModel):
    data_movimentacao: str
    tipo_movimentacao: str
    valor: float
    descricao: Optional[str] = None
    mes_referencia: Optional[str] = None
