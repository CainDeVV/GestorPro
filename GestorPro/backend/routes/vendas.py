from fastapi import APIRouter, HTTPException
from database import get_connection
from datetime import datetime
from schemas.vendas_schema import VendaCreate, VendaUpdate

router = APIRouter(prefix="/vendas", tags=["vendas"])

# Criar venda
@router.post("/")
def registrar_venda(venda: VendaCreate):
    conn = get_connection()
    cursor = conn.cursor()
    data = datetime.now().isoformat()
    
    try:
        # Inicia transação
        cursor.execute("BEGIN TRANSACTION")
        
        # Insere a venda
        cursor.execute("""
            INSERT INTO venda (data_venda, fk_rota_id_rota, fk_vendedor_cpf, fk_cliente_id_cliente, nome_venda, status_venda)
            VALUES (?, ?, ?, ?, ?, 'aberta')
        """, (data, venda.fk_rota_id_rota, venda.fk_vendedor_cpf, venda.fk_cliente_id_cliente, venda.apelido_venda))
        
        # Obtém o ID da venda recém-criada
        venda_id = cursor.lastrowid
        
        # Processa cada item da venda
        for item in venda.itens:
            # Verifica se o produto existe e tem estoque suficiente
            cursor.execute("""
                SELECT quantidade, nome FROM produto 
                WHERE codigo_barras = ?
            """, (item.fk_produto_codigo_barras,))
            
            produto = cursor.fetchone()
            if not produto:
                raise HTTPException(status_code=404, detail=f"Produto {item.fk_produto_codigo_barras} não encontrado")
            
            estoque_atual, nome_produto = produto
            
            if estoque_atual < item.quantidade_vendida:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Estoque insuficiente para {nome_produto}. Disponível: {estoque_atual}, Solicitado: {item.quantidade_vendida}"
                )
            
            # Insere o item da venda
            cursor.execute("""
                INSERT INTO item_venda (fk_venda_id_venda, fk_produto_codigo_barras, quantidade_vendida, preco_unitario_venda)
                VALUES (?, ?, ?, ?)
            """, (venda_id, item.fk_produto_codigo_barras, item.quantidade_vendida, item.preco_unitario_venda))
            
            # Atualiza o estoque do produto
            novo_estoque = estoque_atual - item.quantidade_vendida
            cursor.execute("""
                UPDATE produto SET quantidade = ? WHERE codigo_barras = ?
            """, (novo_estoque, item.fk_produto_codigo_barras))
        
        # Confirma a transação
        cursor.execute("COMMIT")
        
        return {"mensagem": "Venda registrada com sucesso.", "id_venda": venda_id}
        
    except HTTPException:
        # Reverte a transação em caso de erro HTTP
        cursor.execute("ROLLBACK")
        raise
    except Exception as e:
        # Reverte a transação em caso de erro geral
        cursor.execute("ROLLBACK")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Listar todas as vendas
@router.get("/")
def listar_vendas():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.*, 
               c.nome as nome_cliente,
               ve.nome as nome_vendedor,
               r.nome_rota as nome_rota,
               COALESCE(SUM(iv.quantidade_vendida * iv.preco_unitario_venda), 0) as valor_total
        FROM venda v
        LEFT JOIN cliente c ON v.fk_cliente_id_cliente = c.id_cliente
        LEFT JOIN vendedor ve ON v.fk_vendedor_cpf = ve.cpf
        LEFT JOIN rota r ON v.fk_rota_id_rota = r.id_rota
        LEFT JOIN item_venda iv ON v.id_venda = iv.fk_venda_id_venda
        GROUP BY v.id_venda
    """)
    vendas = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return vendas

# Listar vendas abertas
@router.get("/abertas")
def listar_vendas_abertas():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.*, 
               c.nome as nome_cliente,
               ve.nome as nome_vendedor,
               r.nome_rota as nome_rota,
               COALESCE(SUM(iv.quantidade_vendida * iv.preco_unitario_venda), 0) as valor_total
        FROM venda v
        LEFT JOIN cliente c ON v.fk_cliente_id_cliente = c.id_cliente
        LEFT JOIN vendedor ve ON v.fk_vendedor_cpf = ve.cpf
        LEFT JOIN rota r ON v.fk_rota_id_rota = r.id_rota
        LEFT JOIN item_venda iv ON v.id_venda = iv.fk_venda_id_venda
        WHERE v.status_venda = 'aberta'
        GROUP BY v.id_venda
    """)
    vendas = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return vendas

# Fechar venda
@router.put("/{id_venda}/fechar")
def fechar_venda(id_venda: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE venda SET status_venda = 'fechada' WHERE id_venda = ?", (id_venda,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Venda não encontrada.")
        return {"mensagem": "Venda fechada com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Buscar venda pelo ID
@router.get("/{id_venda}")
def buscar_venda(id_venda: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT v.*, 
               c.nome as nome_cliente,
               ve.nome as nome_vendedor,
               r.nome_rota as nome_rota,
               COALESCE(SUM(iv.quantidade_vendida * iv.preco_unitario_venda), 0) as valor_total
        FROM venda v
        LEFT JOIN cliente c ON v.fk_cliente_id_cliente = c.id_cliente
        LEFT JOIN vendedor ve ON v.fk_vendedor_cpf = ve.cpf
        LEFT JOIN rota r ON v.fk_rota_id_rota = r.id_rota
        LEFT JOIN item_venda iv ON v.id_venda = iv.fk_venda_id_venda
        WHERE v.id_venda = ?
        GROUP BY v.id_venda
    """, (id_venda,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(zip([c[0] for c in cursor.description], row))
    raise HTTPException(status_code=404, detail="Venda não encontrada.")

# Buscar itens de uma venda
@router.get("/{id_venda}/itens")
def buscar_itens_venda(id_venda: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT iv.*, p.nome as nome_produto, p.preco_venda
        FROM item_venda iv
        JOIN produto p ON iv.fk_produto_codigo_barras = p.codigo_barras
        WHERE iv.fk_venda_id_venda = ?
    """, (id_venda,))
    itens = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return itens

# Atualizar venda
@router.put("/{id_venda}")
def atualizar_venda(id_venda: int, dados: VendaUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    updates = []
    values = []
    if dados.fk_rota_id_rota is not None:
        updates.append("fk_rota_id_rota = ?")
        values.append(dados.fk_rota_id_rota)
    if dados.fk_cliente_id_cliente is not None:
        updates.append("fk_cliente_id_cliente = ?")
        values.append(dados.fk_cliente_id_cliente)
    if dados.status_venda is not None:
        updates.append("status_venda = ?")
        values.append(dados.status_venda)
    if dados.apelido_venda is not None:
        updates.append("nome_venda = ?")
        values.append(dados.apelido_venda)

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    values.append(id_venda)
    cursor.execute(f"UPDATE venda SET {', '.join(updates)} WHERE id_venda = ?", values)
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Venda não encontrada.")

    conn.close()
    return {"mensagem": "Venda atualizada com sucesso."}

# Deletar venda
@router.delete("/{id_venda}")
def deletar_venda(id_venda: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Inicia transação
        cursor.execute("BEGIN TRANSACTION")
        
        # Primeiro deleta os itens da venda
        cursor.execute("DELETE FROM item_venda WHERE fk_venda_id_venda = ?", (id_venda,))
        
        # Depois deleta a venda
        cursor.execute("DELETE FROM venda WHERE id_venda = ?", (id_venda,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Venda não encontrada.")
        
        # Confirma a transação
        cursor.execute("COMMIT")
        return {"mensagem": "Venda deletada com sucesso."}
        
    except HTTPException:
        # Reverte a transação em caso de erro HTTP
        cursor.execute("ROLLBACK")
        raise
    except Exception as e:
        # Reverte a transação em caso de erro geral
        cursor.execute("ROLLBACK")
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
