from fastapi import APIRouter
from database import get_connection
from schemas.item_expedicao import ItemExpedicaoCreate

router = APIRouter(prefix="/item_expedicao", tags=["Item de Expedição"])

@router.post("/")
def adicionar_item_expedicao(item: ItemExpedicaoCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO item_expedicao (fk_expedicao_id_expedicao, fk_produto_codigo_barras, quantidade_expedida)
        VALUES (?, ?, ?)
    """, (item.fk_expedicao_id_expedicao, item.fk_produto_codigo_barras, item.quantidade_expedida))
    conn.commit()
    conn.close()
    return {"mensagem": "Item de expedição adicionado com sucesso."}
