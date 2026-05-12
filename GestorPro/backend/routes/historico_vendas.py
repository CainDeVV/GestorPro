from fastapi import APIRouter
from estruturas.pilha import Pilha
from database import get_connection
from schemas.historico_vendas import HistoricoVenda

router = APIRouter(prefix="/historico_vendas", tags=["Histórico de Vendas"])

# Instância global da pilha de histórico
pilha_historico = Pilha()

@router.post("/registrar")
def registrar_venda_historico(venda: HistoricoVenda):
    """
    Adiciona uma venda no histórico (pilha).
    """
    pilha_historico.empilhar(venda.venda_id)
    return {"mensagem": "Venda registrada no histórico.", "historico_atual": pilha_historico.mostrar()}

@router.get("/ver_ultima")
def ver_ultima_venda():
    """
    Retorna o ID da última venda registrada no histórico.
    """
    return {"ultima_venda": pilha_historico.topo()}

@router.post("/desfazer")
def desfazer_ultima_venda():
    """
    Remove a última venda registrada (tanto da pilha quanto do banco).
    """
    venda_id = pilha_historico.desempilhar()
    if venda_id is None:
        return {"mensagem": "Histórico vazio. Nenhuma venda para desfazer."}

    conn = get_connection()
    cursor = conn.cursor()

    # Remove itens associados à venda (chave estrangeira)
    cursor.execute("DELETE FROM item_venda WHERE fk_venda_id_venda = ?", (venda_id,))
    cursor.execute("DELETE FROM venda WHERE id_venda = ?", (venda_id,))

    conn.commit()
    conn.close()

    return {"mensagem": f"Venda {venda_id} desfeita com sucesso."}
