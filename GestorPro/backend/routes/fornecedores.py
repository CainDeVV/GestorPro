from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas.fornecedores import FornecedorCreate, FornecedorUpdate

router = APIRouter(prefix="/fornecedores", tags=["fornecedores"])

@router.post("/")
def cadastrar_fornecedor(fornecedor: FornecedorCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO fornecedor (cnpj, nome, endereco, telefone_contato, email)
            VALUES (?, ?, ?, ?, ?)
        """, (fornecedor.cnpj, fornecedor.nome, fornecedor.endereco, fornecedor.telefone_contato, fornecedor.email))
        conn.commit()
        return {"mensagem": "Fornecedor cadastrado com sucesso."}
    except Exception as e:
        error_message = str(e)
        if "UNIQUE constraint failed: fornecedor.cnpj" in error_message:
            raise HTTPException(status_code=400, detail="CNPJ já cadastrado. Use um CNPJ diferente.")
        else:
            raise HTTPException(status_code=400, detail=error_message)
    finally:
        conn.close()

@router.get("/")
def listar_fornecedores():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM fornecedor")
    fornecedores = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return fornecedores

@router.get("/{cnpj}")
def buscar_fornecedor(cnpj: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM fornecedor WHERE cnpj = ?", (cnpj,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(zip([c[0] for c in cursor.description], row))
    raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")

@router.put("/{cnpj}")
def atualizar_fornecedor(cnpj: str, fornecedor: FornecedorUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    updates = []
    values = []
    if fornecedor.nome is not None:
        updates.append("nome = ?")
        values.append(fornecedor.nome)
    if fornecedor.endereco is not None:
        updates.append("endereco = ?")
        values.append(fornecedor.endereco)
    if fornecedor.telefone_contato is not None:
        updates.append("telefone_contato = ?")
        values.append(fornecedor.telefone_contato)
    if fornecedor.email is not None:
        updates.append("email = ?")
        values.append(fornecedor.email)

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    values.append(cnpj)
    cursor.execute(f"UPDATE fornecedor SET {', '.join(updates)} WHERE cnpj = ?", values)
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")

    conn.close()
    return {"mensagem": "Fornecedor atualizado com sucesso."}

@router.delete("/{cnpj}")
def deletar_fornecedor(cnpj: str):
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Verificar se o fornecedor existe
        cursor.execute("SELECT nome FROM fornecedor WHERE cnpj = ?", (cnpj,))
        fornecedor = cursor.fetchone()
        if not fornecedor:
            raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")
        
        # Verificar se há produtos associados
        cursor.execute("SELECT COUNT(*) FROM produto WHERE fk_fornecedor_cnpj = ?", (cnpj,))
        produtos_count = cursor.fetchone()[0]
        
        if produtos_count > 0:
            raise HTTPException(
                status_code=400, 
                detail=f"Não é possível excluir o fornecedor '{fornecedor[0]}' pois existem {produtos_count} produto(s) associado(s) a ele. Remova os produtos primeiro."
            )
        
        # Se não há produtos associados, pode deletar
        cursor.execute("DELETE FROM fornecedor WHERE cnpj = ?", (cnpj,))
        conn.commit()
        
        return {"mensagem": f"Fornecedor '{fornecedor[0]}' deletado com sucesso."}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
    finally:
        conn.close()
