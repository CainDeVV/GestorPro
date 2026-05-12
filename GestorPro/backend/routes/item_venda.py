from fastapi import APIRouter
from database import get_connection
from schemas.item_venda import ItemVendaCreate

router = APIRouter(prefix="/item_venda", tags=["Item de Venda"])

@router.post("/")
def adicionar_item_venda(item: ItemVendaCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO item_venda (fk_venda_id_venda, fk_produto_codigo_barras, quantidade_vendida, preco_unitario_venda)
        VALUES (?, ?, ?, ?)
    """, (item.fk_venda_id_venda, item.fk_produto_codigo_barras, item.quantidade_vendida, item.preco_unitario_venda))
    conn.commit()
    conn.close()
    return {"mensagem": "Item de venda registrado com sucesso."}
