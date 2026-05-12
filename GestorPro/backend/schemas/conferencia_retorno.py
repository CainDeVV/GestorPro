from pydantic import BaseModel
from datetime import datetime

class ConferenciaRetornoCreate(BaseModel):
    id_expedicao: int
    data_hora_conferencia: datetime