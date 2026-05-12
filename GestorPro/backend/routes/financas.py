from fastapi import APIRouter
from database import get_connection
from schemas.financas import MovimentacaoFinanceira

router = APIRouter(prefix="/financas", tags=["Finanças"])

@router.post("/")
def registrar_movimentacao(dados: MovimentacaoFinanceira):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO financas (data_movimentacao, tipo_movimentacao, valor, descricao, mes_referencia)
        VALUES (?, ?, ?, ?, ?)
    """, (
        dados.data_movimentacao,
        dados.tipo_movimentacao,
        dados.valor,
        dados.descricao,
        dados.mes_referencia
    ))
    conn.commit()
    conn.close()
    return {"mensagem": "Movimentação financeira registrada com sucesso."}
