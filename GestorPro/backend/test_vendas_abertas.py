import requests
import json

# Testar o endpoint de vendas abertas
try:
    response = requests.get('http://localhost:8000/vendas/abertas')
    print(f'Status Code: {response.status_code}')
    print(f'Response: {response.text}')
    
    if response.status_code == 200:
        vendas = response.json()
        print(f'\nTotal de vendas abertas: {len(vendas)}')
        for venda in vendas:
            print(f'Venda {venda["id_venda"]}: {venda["status_venda"]}')
    
except Exception as e:
    print(f'Erro: {e}') 