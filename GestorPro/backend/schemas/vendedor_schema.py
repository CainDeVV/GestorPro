from pydantic import BaseModel
from typing import Optional

class VendedorCreate(BaseModel):
    cpf: str
    nome: str
    telefone: Optional[str] = None

class VendedorUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None
