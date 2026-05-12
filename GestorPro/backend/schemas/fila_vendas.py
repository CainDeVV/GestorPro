from pydantic import BaseModel
from typing import Optional

class VendaFila(BaseModel):
    cpf_vendedor: str
    cliente_id: Optional[int] = None
