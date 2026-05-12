from fastapi import APIRouter, HTTPException
from database import get_connection

router = APIRouter(prefix="/produtos", tags=["produtos"])

# Listar todos os produtos
@router.get("/")
def listar_produtos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, f.nome as nome_fornecedor 
        FROM produto p 
        JOIN fornecedor f ON p.fk_fornecedor_cnpj = f.cnpj
    """)
    produtos = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return produtos

# Buscar produto por código de barras
@router.get("/{codigo_barras}")
def buscar_produto(codigo_barras: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, f.nome as nome_fornecedor 
        FROM produto p 
        JOIN fornecedor f ON p.fk_fornecedor_cnpj = f.cnpj 
        WHERE p.codigo_barras = ?
    """, (codigo_barras,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(zip([c[0] for c in cursor.description], row))
    raise HTTPException(status_code=404, detail="Produto não encontrado.")

# Criar produto
@router.post("/")
def criar_produto(produto: dict):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO produto (codigo_barras, lote, nome, quantidade, preco_venda, preco_custo, categoria, peso, descricao, fk_fornecedor_cnpj)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            produto['codigo_barras'], produto['lote'], produto['nome'], produto['quantidade'],
            produto['preco_venda'], produto['preco_custo'], produto['categoria'], produto['peso'],
            produto['descricao'], produto['fk_fornecedor_cnpj']
        ))
        conn.commit()
        return {"mensagem": "Produto criado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Atualizar produto
@router.put("/{codigo_barras}")
def atualizar_produto(codigo_barras: str, produto: dict):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE produto SET lote=?, nome=?, quantidade=?, preco_venda=?, preco_custo=?, categoria=?, peso=?, descricao=?, fk_fornecedor_cnpj=?
            WHERE codigo_barras=?
        """, (
            produto['lote'], produto['nome'], produto['quantidade'], produto['preco_venda'],
            produto['preco_custo'], produto['categoria'], produto['peso'], produto['descricao'],
            produto['fk_fornecedor_cnpj'], codigo_barras
        ))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Produto não encontrado.")
        return {"mensagem": "Produto atualizado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Deletar produto
@router.delete("/{codigo_barras}")
def deletar_produto(codigo_barras: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM produto WHERE codigo_barras = ?", (codigo_barras,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    conn.close()
    return {"mensagem": "Produto deletado com sucesso."}

# Buscar produtos com estoque baixo (para alertas)
@router.get("/estoque/baixo")
def produtos_estoque_baixo(limite: int = 10):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, f.nome as nome_fornecedor 
        FROM produto p 
        JOIN fornecedor f ON p.fk_fornecedor_cnpj = f.cnpj 
        WHERE p.quantidade <= ?
        ORDER BY p.quantidade ASC
    """, (limite,))
    produtos = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return produtos

# Buscar produtos por categoria
@router.get("/categoria/{categoria}")
def produtos_por_categoria(categoria: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, f.nome as nome_fornecedor 
        FROM produto p 
        JOIN fornecedor f ON p.fk_fornecedor_cnpj = f.cnpj 
        WHERE p.categoria = ?
    """, (categoria,))
    produtos = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return produtos

# Buscar produtos por fornecedor
@router.get("/fornecedor/{cnpj}")
def produtos_por_fornecedor(cnpj: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, f.nome as nome_fornecedor 
        FROM produto p 
        JOIN fornecedor f ON p.fk_fornecedor_cnpj = f.cnpj 
        WHERE p.fk_fornecedor_cnpj = ?
    """, (cnpj,))
    produtos = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return produtos
