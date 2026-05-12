from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import (
    produtos,
    vendedores,
    vendas,
    clientes,
    fornecedores,
    rotas,
    expedicao,
    item_expedicao,
    conferencia_retorno,
    item_venda,
    financas,
    fila_vendas,
    historico_vendas,
    views,
    relatorios
)

import os
import subprocess


if os.path.exists("requirements.txt"):
    try:
        subprocess.run(["pip", "install", "-r", "requirements.txt"], check=True)
        print("[INFO] Requisitos instalados com sucesso.")
    except Exception as e:
        print(f"[ERRO] Falha ao instalar dependências: {e}")


try:
    from init_db import init_db
    init_db(delete_old=False)
except Exception as e:
    print(f"[ERRO] Falha ao inicializar banco: {e}")


app = FastAPI(title="Sistema de Vendas - API")

# Configuração do CORS para permitir acesso de todos os sites
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos os origins
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP
    allow_headers=["*"],  # Permite todos os headers
)

app.include_router(produtos.router)
app.include_router(vendedores.router)
app.include_router(vendas.router)
app.include_router(clientes.router)
app.include_router(fornecedores.router)
app.include_router(rotas.router)
app.include_router(expedicao.router)
app.include_router(item_expedicao.router)
app.include_router(conferencia_retorno.router)
app.include_router(item_venda.router)
app.include_router(financas.router)
app.include_router(fila_vendas.router)
app.include_router(historico_vendas.router)
app.include_router(views.router)
app.include_router(relatorios.router)

@app.get("/")
def home():
    return {"mensagem": "API do Sistema de Vendas está rodando!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
