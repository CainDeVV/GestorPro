import sqlite3
import os
from models import tables, views

DB_NAME = "sistema_vendas.db"

def coluna_existe(cursor, tabela, coluna):
    cursor.execute(f"PRAGMA table_info({tabela})")
    colunas = [c[1] for c in cursor.fetchall()]
    return coluna in colunas

def reset_all_data():
    """
    Função para resetar todos os dados do banco, mantendo a estrutura das tabelas.
    Remove todos os registros de todas as tabelas.
    """
    if not os.path.exists(DB_NAME):
        print(f"[ERRO] Banco de dados '{DB_NAME}' não encontrado!")
        return False
    
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("PRAGMA foreign_keys = OFF;")  # Desabilita foreign keys temporariamente
        
        # Lista de todas as tabelas para limpar (em ordem para evitar problemas de FK)
        tables_to_clear = [
            "item_venda",
            "item_expedicao", 
            "venda",
            "produto",
            "cliente",
            "vendedor",
            "fornecedor",
            "rota"
        ]
        
        print(" Iniciando reset de todos os dados...")
        
        for table in tables_to_clear:
            try:
                cursor.execute(f"DELETE FROM {table}")
                deleted_count = cursor.rowcount
                print(f"✅ {table}: {deleted_count} registros removidos")
            except Exception as e:
                print(f"⚠️  {table}: Erro ao limpar - {e}")
        
        # Reabilita foreign keys
        cursor.execute("PRAGMA foreign_keys = ON;")
        
        # Otimiza o banco (remove espaço não utilizado)
        cursor.execute("VACUUM;")
        
        conn.commit()
        conn.close()
        
        print("✅ Reset completo realizado com sucesso!")
        print("🎉 Todos os dados foram removidos do banco.")
        return True
        
    except Exception as e:
        print(f"[ERRO] Falha ao resetar dados: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False

def init_db(delete_old=False):
    # Ambiente DEV: apaga o banco
    if delete_old and os.path.exists(DB_NAME):
        os.remove(DB_NAME)
        print(f"[INFO] Banco de dados antigo '{DB_NAME}' removido.")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")


    for table_sql in tables:
        cursor.execute(table_sql)


    if not coluna_existe(cursor, "produto", "preco_venda"):
        cursor.execute("ALTER TABLE produto ADD COLUMN preco_venda REAL")
    if not coluna_existe(cursor, "produto", "preco_custo"):
        cursor.execute("ALTER TABLE produto ADD COLUMN preco_custo REAL")
    if not coluna_existe(cursor, "produto", "categoria"):
        cursor.execute("ALTER TABLE produto ADD COLUMN categoria TEXT")
    if not coluna_existe(cursor, "produto", "peso"):
        cursor.execute("ALTER TABLE produto ADD COLUMN peso REAL")
    if not coluna_existe(cursor, "produto", "descricao"):
        cursor.execute("ALTER TABLE produto ADD COLUMN descricao TEXT")

    # FORNECEDOR - novas colunas
    if not coluna_existe(cursor, "fornecedor", "nome"):
        cursor.execute("ALTER TABLE fornecedor ADD COLUMN nome TEXT")
    if not coluna_existe(cursor, "fornecedor", "email"):
        cursor.execute("ALTER TABLE fornecedor ADD COLUMN email TEXT")

    # VENDEDOR - nova coluna
    if not coluna_existe(cursor, "vendedor", "apelido"):
        cursor.execute("ALTER TABLE vendedor ADD COLUMN apelido TEXT")

    # VENDA - nova coluna
    if not coluna_existe(cursor, "venda", "nome_venda"):
        cursor.execute("ALTER TABLE venda ADD COLUMN nome_venda TEXT")

    # 3️⃣ Criar/Recriar views
    for view_sql in views:
        cursor.execute(view_sql)

    conn.commit()
    conn.close()
    print(f"[INFO] Banco de dados '{DB_NAME}' inicializado com sucesso!")


if __name__ == "__main__":
    # DEV: passe True para apagar dados e recriar tudo
    # PRODUÇÃO: deixe False (mantém dados e só adiciona campos)
    init_db(delete_old=False)
