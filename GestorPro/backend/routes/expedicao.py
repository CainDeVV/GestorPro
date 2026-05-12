from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas.expedicao import ExpedicaoCreate

router = APIRouter(prefix="/expedicao", tags=["Expedição"])

@router.post("/")
def cadastrar_expedicao(dados: ExpedicaoCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO expedicao (data_hora_expedicao, fk_carro_id_carro, fk_vendedor_cpf)
            VALUES (?, ?, ?)
        """, (dados.data_hora_expedicao.isoformat(), dados.fk_carro_id_carro, dados.fk_vendedor_cpf))
        conn.commit()
        return {"mensagem": "Expedição registrada com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
