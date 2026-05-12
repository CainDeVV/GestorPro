from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas.clientes import ClienteCreate, ClienteUpdate

router = APIRouter(prefix="/clientes", tags=["clientes"])

# Criar cliente
@router.post("/")
def cadastrar_cliente(cliente: ClienteCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO cliente (nome, endereco, telefone, cpf_cnpj)
            VALUES (?, ?, ?, ?)
        """, (cliente.nome, cliente.endereco, cliente.telefone, cliente.cpf_cnpj))
        conn.commit()
        return {"mensagem": "Cliente cadastrado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Listar clientes
@router.get("/")
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cliente")
    clientes = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return clientes

# Buscar cliente por ID
@router.get("/{id_cliente}")
def buscar_cliente(id_cliente: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cliente WHERE id_cliente = ?", (id_cliente,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(zip([c[0] for c in cursor.description], row))
    raise HTTPException(status_code=404, detail="Cliente não encontrado.")

# Atualizar cliente
@router.put("/{id_cliente}")
def atualizar_cliente(id_cliente: int, cliente: ClienteUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    updates = []
    values = []

    if cliente.nome is not None:
        updates.append("nome = ?")
        values.append(cliente.nome)
    if cliente.endereco is not None:
        updates.append("endereco = ?")
        values.append(cliente.endereco)
    if cliente.telefone is not None:
        updates.append("telefone = ?")
        values.append(cliente.telefone)
    if cliente.cpf_cnpj is not None:
        updates.append("cpf_cnpj = ?")
        values.append(cliente.cpf_cnpj)

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    values.append(id_cliente)
    cursor.execute(f"UPDATE cliente SET {', '.join(updates)} WHERE id_cliente = ?", values)
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    conn.close()
    return {"mensagem": "Cliente atualizado com sucesso."}

# Deletar cliente
@router.delete("/{id_cliente}")
def deletar_cliente(id_cliente: int):
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Verificar se o cliente existe
        cursor.execute("SELECT nome FROM cliente WHERE id_cliente = ?", (id_cliente,))
        cliente = cursor.fetchone()
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente não encontrado.")
        
        # Verificar se há vendas associadas
        cursor.execute("SELECT COUNT(*) FROM venda WHERE fk_cliente_id_cliente = ?", (id_cliente,))
        vendas_count = cursor.fetchone()[0]
        
        if vendas_count > 0:
            raise HTTPException(
                status_code=400, 
                detail=f"Não é possível excluir o cliente '{cliente[0]}' pois existem {vendas_count} venda(s) associada(s) a ele. Remova as vendas primeiro."
            )
        
        # Se não há vendas associadas, pode deletar
        cursor.execute("DELETE FROM cliente WHERE id_cliente = ?", (id_cliente,))
        conn.commit()
        
        return {"mensagem": f"Cliente '{cliente[0]}' deletado com sucesso."}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        conn.close()
