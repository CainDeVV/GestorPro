#  GestorPro

Sistema de gestão comercial desenvolvido para controle de vendas, estoque, clientes, fornecedores e expedição. Composto por um backend em Python (FastAPI) e um aplicativo mobile em React Native (Expo).

---

## 🛠️ Tecnologias

### Backend
- **Python 3.13**
- **FastAPI** — framework web para construção da API REST
- **SQLite** — banco de dados relacional local
- **Uvicorn** — servidor ASGI

### Frontend
- **React Native 0.79** com **Expo 53**
- **TypeScript**
- **NativeWind** (Tailwind CSS para React Native)
- **Expo Router** — navegação baseada em arquivos

---

##  Estrutura do Projeto

```
GestorPro/
├── backend/
│   ├── main.py               # Ponto de entrada da API
│   ├── models.py             # Definição das tabelas do banco de dados
│   ├── database.py           # Conexão com o SQLite
│   ├── init_db.py            # Inicialização do banco de dados
│   ├── routes/               # Rotas da API (um arquivo por módulo)
│   │   ├── produtos.py
│   │   ├── vendas.py
│   │   ├── clientes.py
│   │   ├── fornecedores.py
│   │   ├── vendedores.py
│   │   ├── rotas.py
│   │   ├── expedicao.py
│   │   ├── financas.py
│   │   ├── relatorios.py
│   │   └── ...
│   ├── schemas/              # Schemas Pydantic para validação
│   ├── estruturas/           # Estruturas de dados (Fila e Pilha)
│   └── requirements.txt
│
└── frontend/
    ├── app/                  # Telas e rotas (Expo Router)
    │   ├── (tabs)/
    │   │   ├── (home)/       # Módulos principais
    │   │   │   ├── venda/
    │   │   │   ├── cliente/
    │   │   │   ├── fornecedor/
    │   │   │   ├── estoque/
    │   │   │   ├── vendedor/
    │   │   │   ├── rota/
    │   │   │   └── cadastrar/
    │   │   └── (stats)/      # Tela de relatórios/estatísticas
    │   └── api/              # Funções de comunicação com o backend
    ├── components/           # Componentes reutilizáveis
    ├── types/                # Interfaces TypeScript
    └── context/              # Context API (estado global de vendas)
```

---

##  Funcionalidades

- **Produtos** — Cadastro, edição, exclusão e controle de estoque com alerta de baixo estoque
- **Vendas** — Abertura, adição de itens, seleção de cliente/vendedor/rota e fechamento de vendas
- **Clientes** — Cadastro e gerenciamento de clientes com CPF/CNPJ
- **Fornecedores** — Cadastro de fornecedores por CNPJ com vínculo aos produtos
- **Vendedores** — Cadastro de vendedores com CPF e apelido
- **Rotas** — Criação e gerenciamento de rotas de entrega
- **Expedição** — Registro de saída de produtos com vínculo a carro e vendedor
- **Conferência de Retorno** — Controle de retorno da expedição
- **Finanças** — Registro de movimentações financeiras por mês de referência
- **Relatórios** — Visualização de estatísticas de vendas por vendedor e produtos por fornecedor

---

##  Como Rodar o Projeto

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Aplicativo **Expo Go** no celular (para testar no dispositivo físico)

---

### Backend

```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor
python main.py
```

O servidor estará disponível em `http://localhost:8000`.

Acesse a documentação interativa da API em: `http://localhost:8000/docs`

---

### Frontend

```bash
# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o Expo
npx expo start
```

> ⚠️ **Importante:** Antes de rodar o app, abra o arquivo `frontend/app/api/config.ts` e substitua `localhost` pelo IP local da máquina que está rodando o backend. Exemplo:
> ```ts
> export const BASE_URL = 'http://192.168.1.10:8000';
> ```
> Isso é necessário para que o celular consiga se comunicar com a API.

---

##  Banco de Dados

O banco de dados é gerado automaticamente ao iniciar o backend. As tabelas criadas são:

| Tabela                  | Descrição                                  |
|-------------------------|--------------------------------------------|
| `fornecedor`            | Fornecedores de produtos                   |
| `produto`               | Produtos do estoque                        |
| `vendedor`              | Vendedores cadastrados                     |
| `carro_venda`           | Veículos usados nas expedições             |
| `rota`                  | Rotas de entrega                           |
| `cliente`               | Clientes                                   |
| `expedicao`             | Saídas de expedição                        |
| `item_expedicao`        | Itens de cada expedição                    |
| `conferencia_retorno`   | Registro de retorno de expedição           |
| `venda`                 | Cabeçalho das vendas                       |
| `item_venda`            | Produtos de cada venda                     |
| `financas`              | Movimentações financeiras                  |

---

##  Principais Endpoints da API

| Método | Endpoint           | Descrição                  |
|--------|--------------------|----------------------------|
| GET    | `/produtos`        | Lista todos os produtos     |
| POST   | `/produtos`        | Cadastra um produto         |
| GET    | `/clientes`        | Lista todos os clientes     |
| POST   | `/vendas`          | Abre uma nova venda         |
| PUT    | `/vendas/{id}`     | Atualiza/fecha uma venda    |
| GET    | `/relatorios`      | Retorna relatórios gerais   |
| GET    | `/financas`        | Lista movimentações         |

Documentação completa disponível em `/docs` após iniciar o backend.

---

##  Autores

Desenvolvido como projeto acadêmico.
