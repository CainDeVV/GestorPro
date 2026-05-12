from pydantic import BaseModel
from datetime import datetime

class ExpedicaoCreate(BaseModel):
    data_hora_expedicao: datetime
    fk_carro_id_carro: int
    fk_vendedor_cpf: str
