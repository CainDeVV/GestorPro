import sqlite3

DB_NAME = "sistema_vendas.db"

def get_connection():
    """
    Abre uma conexão com o banco de dados local SQLite e ativa as foreign keys.
    """
    conn = sqlite3.connect(DB_NAME)
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def execute_query(query, params=None):
    """
    Executa queries de INSERT, UPDATE ou DELETE.
    """
    conn = get_connection()
    cursor = conn.cursor()
    if params:
        cursor.execute(query, params)
    else:
        cursor.execute(query)
    conn.commit()
    conn.close()

def fetch_all(query, params=None):
    """
    Executa SELECT e retorna todas as linhas como lista de dicionários.
    """
    conn = get_connection()
    cursor = conn.cursor()
    if params:
        cursor.execute(query, params)
    else:
        cursor.execute(query)

    # Pega os nomes das colunas
    colunas = [col[0] for col in cursor.description]
    resultados = [dict(zip(colunas, row)) for row in cursor.fetchall()]
    
    conn.close()
    return resultados


def fetch_one(query, params=None):
    """
    Executa SELECT e retorna apenas uma linha.
    """
    conn = get_connection()
    cursor = conn.cursor()
    if params:
        cursor.execute(query, params)
    else:
        cursor.execute(query)
    row = cursor.fetchone()
    conn.close()
    return row
