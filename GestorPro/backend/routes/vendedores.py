from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas.vendedor_schema import VendedorCreate, VendedorUpdate

router = APIRouter(prefix="/vendedores", tags=["vendedores"])

# Criar vendedor
@router.post("/")
def cadastrar_vendedor(vendedor: VendedorCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO vendedor (cpf, nome, telefone)
            VALUES (?, ?, ?)
        """, (vendedor.cpf, vendedor.nome, vendedor.telefone))
        conn.commit()
        return {"mensagem": "Vendedor cadastrado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()

# Listar todos os vendedores
@router.get("/")
def listar_vendedores():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vendedor")
    vendedores = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return vendedores

# Buscar vendedor pelo CPF
@router.get("/{cpf}")
def buscar_vendedor(cpf: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vendedor WHERE cpf = ?", (cpf,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(zip([c[0] for c in cursor.description], row))
    raise HTTPException(status_code=404, detail="Vendedor não encontrado.")

# Atualizar vendedor
@router.put("/{cpf}")
def atualizar_vendedor(cpf: str, dados: VendedorUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    updates = []
    values = []
    if dados.nome:
        updates.append("nome = ?")
        values.append(dados.nome)
    if dados.telefone:
        updates.append("telefone = ?")
        values.append(dados.telefone)

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    values.append(cpf)
    cursor.execute(f"UPDATE vendedor SET {', '.join(updates)} WHERE cpf = ?", values)
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado.")

    conn.close()
    return {"mensagem": "Vendedor atualizado com sucesso."}

# Deletar vendedor
@router.delete("/{cpf}")
def deletar_vendedor(cpf: str):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar se o vendedor existe
    cursor.execute("SELECT * FROM vendedor WHERE cpf = ?", (cpf,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Vendedor não encontrado.")
    
    # Verificar se existem vendas associadas a este vendedor
    cursor.execute("SELECT COUNT(*) FROM venda WHERE fk_vendedor_cpf = ?", (cpf,))
    vendas_count = cursor.fetchone()[0]
    
    # Verificar se existem expedições associadas a este vendedor
    cursor.execute("SELECT COUNT(*) FROM expedicao WHERE fk_vendedor_cpf = ?", (cpf,))
    expedicoes_count = cursor.fetchone()[0]
    
    if vendas_count > 0 or expedicoes_count > 0:
        conn.close()
        error_message = "⚠️ Não é possível excluir este vendedor!\n\n"
        
        if vendas_count > 0:
            error_message += f"• Este vendedor está sendo usado por {vendas_count} venda(s)\n"
        if expedicoes_count > 0:
            error_message += f"• Este vendedor está sendo usado por {expedicoes_count} expedição(ões)\n"
        
        error_message += "\nPara excluir o vendedor, você precisa primeiro:\n"
        error_message += "• Fechar ou cancelar todas as vendas associadas\n"
        error_message += "• Finalizar todas as expedições associadas"
        
        raise HTTPException(status_code=400, detail=error_message)
    
    # Se não há dependências, pode deletar o vendedor
    cursor.execute("DELETE FROM vendedor WHERE cpf = ?", (cpf,))
    conn.commit()
    conn.close()
    return {"mensagem": "Vendedor deletado com sucesso."}
