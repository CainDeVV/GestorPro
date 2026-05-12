from fastapi import APIRouter
from estruturas.fila import Fila
from database import get_connection
from datetime import datetime
from schemas.fila_vendas import VendaFila

router = APIRouter(prefix="/fila_vendas", tags=["Fila de Vendas"])

# Instância global da fila de vendas
fila_vendas = Fila()

@router.post("/adicionar")
def adicionar_venda(dados: VendaFila):
    """
    Adiciona uma venda na fila de vendas pendentes.
    """
    venda = {
        "cpf_vendedor": dados.cpf_vendedor,
        "cliente_id": dados.cliente_id,
        "data": datetime.now().isoformat()
    }
    fila_vendas.enfileirar(venda)
    return {"mensagem": "Venda adicionada à fila.", "fila_atual": list(fila_vendas.itens)}

@router.get("/")
def listar_vendas_fila():
    """
    Lista todas as vendas na fila.
    """
    return {"fila_vendas": list(fila_vendas.itens)}

@router.post("/processar")
def processar_fila():
    """
    Processa todas as vendas na fila e salva no banco na ordem que foram enfileiradas.
    """
    conn = get_connection()
    cursor = conn.cursor()
    processadas = []

    while not fila_vendas.vazia():
        venda = fila_vendas.desenfileirar()
        cursor.execute(
            "INSERT INTO venda (fk_vendedor_cpf, fk_cliente_id_cliente, data_venda) VALUES (?, ?, ?)",
            (venda["cpf_vendedor"], venda["cliente_id"], venda["data"])
        )
        processadas.append(venda)

    conn.commit()
    conn.close()
    return {"mensagem": "Fila processada.", "vendas_processadas": processadas}
