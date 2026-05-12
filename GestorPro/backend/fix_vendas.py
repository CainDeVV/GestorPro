import sqlite3

conn = sqlite3.connect('sistema_vendas.db')
cursor = conn.cursor()

# Verificar registros com status NULL
cursor.execute('SELECT COUNT(*) FROM venda WHERE status_venda IS NULL')
null_count = cursor.fetchone()[0]
print(f'Registros com status NULL: {null_count}')

# Atualizar registros existentes para 'aberta'
if null_count > 0:
    cursor.execute("UPDATE venda SET status_venda = 'aberta' WHERE status_venda IS NULL")
    conn.commit()
    print('Registros atualizados para status "aberta"')

# Verificar todos os registros
cursor.execute('SELECT id_venda, status_venda FROM venda')
vendas = cursor.fetchall()
print('\nStatus das vendas:')
for venda in vendas:
    print(f'Venda {venda[0]}: {venda[1]}')

conn.close() 