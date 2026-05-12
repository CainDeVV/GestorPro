import sqlite3
import os

def update_database():
    db_path = 'sistema_vendas.db'
    
    if not os.path.exists(db_path):
        print("Banco de dados não encontrado. Execute init_db.py primeiro.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Verificar se a coluna status_venda já existe
        cursor.execute("PRAGMA table_info(venda)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'status_venda' not in columns:
            print("Adicionando coluna status_venda à tabela venda...")
            cursor.execute("ALTER TABLE venda ADD COLUMN status_venda TEXT NOT NULL DEFAULT 'aberta'")
            conn.commit()
            print("Coluna status_venda adicionada com sucesso!")
        else:
            print("Coluna status_venda já existe na tabela venda.")
        
        # Verificar se há dados existentes e atualizar para 'aberta' se necessário
        cursor.execute("SELECT COUNT(*) FROM venda WHERE status_venda IS NULL")
        null_count = cursor.fetchone()[0]
        
        if null_count > 0:
            print(f"Atualizando {null_count} registros existentes para status 'aberta'...")
            cursor.execute("UPDATE venda SET status_venda = 'aberta' WHERE status_venda IS NULL")
            conn.commit()
            print("Registros atualizados com sucesso!")
        
        print("Atualização do banco de dados concluída!")
        
    except Exception as e:
        print(f"Erro ao atualizar banco de dados: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    update_database() 