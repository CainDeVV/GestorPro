from pydantic import BaseModel
from typing import Optional

class RotaBase(BaseModel):
    nome_rota: str
    descricao_rota: Optional[str] = None

class RotaCreate(RotaBase):
    pass

class RotaUpdate(RotaBase):
    nome_rota: Optional[str] = None 