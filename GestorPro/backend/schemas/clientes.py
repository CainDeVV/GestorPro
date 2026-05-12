from pydantic import BaseModel
from typing import Optional

class ClienteCreate(BaseModel):
    nome: str
    endereco: Optional[str] = None
    telefone: Optional[str] = None
    cpf_cnpj: Optional[str] = None

class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    endereco: Optional[str] = None
    telefone: Optional[str] = None
    cpf_cnpj: Optional[str] = None
