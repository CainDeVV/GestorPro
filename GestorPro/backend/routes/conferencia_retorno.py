from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas.conferencia_retorno import ConferenciaRetornoCreate

router = APIRouter(prefix="/conferencia", tags=["Conferência de Retorno"])

@router.post("/")
def registrar_conferencia(dados: ConferenciaRetornoCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO conferencia_retorno (fk_expedicao_id_expedicao, data_hora_conferencia)
            VALUES (?, ?)
        """, (dados.id_expedicao, dados.data_hora_conferencia.isoformat()))
        conn.commit()
        return {"mensagem": "Conferência de retorno registrada com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
