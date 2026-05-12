import requests
import json

# Testar fechar a venda com ID 1
try:
    response = requests.put('http://localhost:8000/vendas/1/fechar')
    print(f'Status Code: {response.status_code}')
    print(f'Response: {response.text}')
    
    if response.status_code == 200:
        print('Venda fechada com sucesso!')
        
        # Verificar se a venda foi realmente fechada
        response2 = requests.get('http://localhost:8000/vendas/1')
        if response2.status_code == 200:
            venda = response2.json()
            print(f'Status da venda após fechamento: {venda["status_venda"]}')
    
except Exception as e:
    print(f'Erro: {e}') 