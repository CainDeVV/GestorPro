from pydantic import BaseModel
from typing import Optional

class FornecedorBase(BaseModel):
    nome: str
    endereco: Optional[str] = None
    telefone_contato: Optional[str] = None
    email: Optional[str] = None

class FornecedorCreate(FornecedorBase):
    cnpj: str

class FornecedorUpdate(FornecedorBase):
    nome: Optional[str] = None