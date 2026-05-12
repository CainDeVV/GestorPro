from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas.rotas import RotaCreate, RotaUpdate

router = APIRouter(prefix="/rotas", tags=["rotas"])

@router.post("/")
def cadastrar_rota(rota: RotaCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO rota (nome_rota, descricao_rota)
            VALUES (?, ?)
        """, (rota.nome_rota, rota.descricao_rota))
        conn.commit()
        return {"mensagem": "Rota cadastrada com sucesso."}
    except Exception as e:
        error_message = str(e)
        if "UNIQUE constraint failed: rota.nome_rota" in error_message:
            raise HTTPException(status_code=400, detail="Nome da rota já cadastrado. Use um nome diferente.")
        else:
            raise HTTPException(status_code=400, detail=error_message)
    finally:
        conn.close()

@router.get("/")
def listar_rotas():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rota")
    rotas = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return rotas

@router.get("/{id_rota}")
def buscar_rota_por_id(id_rota: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rota WHERE id_rota = ?", (id_rota,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(zip([c[0] for c in cursor.description], row))
    raise HTTPException(status_code=404, detail="Rota não encontrada.")

@router.get("/nome/{nome_rota}")
def buscar_rota_por_nome(nome_rota: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rota WHERE nome_rota = ?", (nome_rota,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(zip([c[0] for c in cursor.description], row))
    raise HTTPException(status_code=404, detail="Rota não encontrada.")

@router.put("/{id_rota}")
def atualizar_rota_por_id(id_rota: int, rota: RotaUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    updates = []
    values = []
    if rota.nome_rota is not None:
        updates.append("nome_rota = ?")
        values.append(rota.nome_rota)
    if rota.descricao_rota is not None:
        updates.append("descricao_rota = ?")
        values.append(rota.descricao_rota)

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    values.append(id_rota)
    try:
        cursor.execute(f"UPDATE rota SET {', '.join(updates)} WHERE id_rota = ?", values)
        conn.commit()
    except Exception as e:
        error_message = str(e)
        if "UNIQUE constraint failed: rota.nome_rota" in error_message:
            raise HTTPException(status_code=400, detail="Nome da rota já cadastrado. Use um nome diferente.")
        else:
            raise HTTPException(status_code=400, detail=error_message)

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Rota não encontrada.")

    conn.close()
    return {"mensagem": "Rota atualizada com sucesso."}

@router.put("/nome/{nome_rota}")
def atualizar_rota_por_nome(nome_rota: str, rota: RotaUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    updates = []
    values = []
    if rota.nome_rota is not None:
        updates.append("nome_rota = ?")
        values.append(rota.nome_rota)
    if rota.descricao_rota is not None:
        updates.append("descricao_rota = ?")
        values.append(rota.descricao_rota)

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    values.append(nome_rota)
    try:
        cursor.execute(f"UPDATE rota SET {', '.join(updates)} WHERE nome_rota = ?", values)
        conn.commit()
    except Exception as e:
        error_message = str(e)
        if "UNIQUE constraint failed: rota.nome_rota" in error_message:
            raise HTTPException(status_code=400, detail="Nome da rota já cadastrado. Use um nome diferente.")
        else:
            raise HTTPException(status_code=400, detail=error_message)

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Rota não encontrada.")

    conn.close()
    return {"mensagem": "Rota atualizada com sucesso."}

@router.delete("/{id_rota}")
def deletar_rota_por_id(id_rota: int):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar se a rota existe
    cursor.execute("SELECT * FROM rota WHERE id_rota = ?", (id_rota,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Rota não encontrada.")
    
    # Verificar se existem vendas associadas a esta rota
    cursor.execute("SELECT COUNT(*) FROM venda WHERE fk_rota_id_rota = ?", (id_rota,))
    vendas_count = cursor.fetchone()[0]
    
    if vendas_count > 0:
        conn.close()
        raise HTTPException(
            status_code=400, 
            detail=f"⚠️ Não é possível excluir esta rota!\n\nEsta rota está sendo usada por {vendas_count} venda(s) no sistema.\n\nPara excluir a rota, você precisa primeiro:\n• Fechar ou cancelar todas as vendas associadas\n• Ou transferir as vendas para outra rota"
        )
    
    # Se não há vendas associadas, pode deletar a rota
    cursor.execute("DELETE FROM rota WHERE id_rota = ?", (id_rota,))
    conn.commit()
    conn.close()
    return {"mensagem": "Rota deletada com sucesso."}

@router.delete("/nome/{nome_rota}")
def deletar_rota_por_nome(nome_rota: str):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar se a rota existe
    cursor.execute("SELECT id_rota FROM rota WHERE nome_rota = ?", (nome_rota,))
    rota = cursor.fetchone()
    if not rota:
        conn.close()
        raise HTTPException(status_code=404, detail="Rota não encontrada.")
    
    id_rota = rota[0]
    
    # Verificar se existem vendas associadas a esta rota
    cursor.execute("SELECT COUNT(*) FROM venda WHERE fk_rota_id_rota = ?", (id_rota,))
    vendas_count = cursor.fetchone()[0]
    
    if vendas_count > 0:
        conn.close()
        raise HTTPException(
            status_code=400, 
            detail=f"⚠️ Não é possível excluir esta rota!\n\nEsta rota está sendo usada por {vendas_count} venda(s) no sistema.\n\nPara excluir a rota, você precisa primeiro:\n• Fechar ou cancelar todas as vendas associadas\n• Ou transferir as vendas para outra rota"
        )
    
    # Se não há vendas associadas, pode deletar a rota
    cursor.execute("DELETE FROM rota WHERE nome_rota = ?", (nome_rota,))
    conn.commit()
    conn.close()
    return {"mensagem": "Rota deletada com sucesso."} 