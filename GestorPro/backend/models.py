fornecedor_table = """
CREATE TABLE IF NOT EXISTS fornecedor (
    cnpj TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    endereco TEXT,
    telefone_contato TEXT,
    email TEXT
);
"""

produto_table = """
CREATE TABLE IF NOT EXISTS produto (
    codigo_barras TEXT PRIMARY KEY,
    lote TEXT,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 0,
    preco_venda REAL,
    preco_custo REAL,
    categoria TEXT,
    peso REAL,
    descricao TEXT,
    fk_fornecedor_cnpj TEXT NOT NULL,
    FOREIGN KEY (fk_fornecedor_cnpj) REFERENCES fornecedor(cnpj)
);
"""

vendedor_table = """
CREATE TABLE IF NOT EXISTS vendedor (
    cpf TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    apelido TEXT,
    telefone TEXT
);
"""

carro_venda_table = """
CREATE TABLE IF NOT EXISTS carro_venda (
    id_carro INTEGER PRIMARY KEY AUTOINCREMENT,
    placa TEXT NOT NULL UNIQUE,
    modelo TEXT,
    capacidade TEXT
);
"""

rota_table = """
CREATE TABLE IF NOT EXISTS rota (
    id_rota INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_rota TEXT NOT NULL UNIQUE,
    descricao_rota TEXT
);
"""

cliente_table = """
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT,
    telefone TEXT,
    cpf_cnpj TEXT UNIQUE
);
"""

expedicao_table = """
CREATE TABLE IF NOT EXISTS expedicao (
    id_expedicao INTEGER PRIMARY KEY AUTOINCREMENT,
    data_hora_expedicao TEXT NOT NULL,
    fk_carro_id_carro INTEGER NOT NULL,
    fk_vendedor_cpf TEXT NOT NULL,
    FOREIGN KEY (fk_carro_id_carro) REFERENCES carro_venda(id_carro),
    FOREIGN KEY (fk_vendedor_cpf) REFERENCES vendedor(cpf)
);
"""

item_expedicao_table = """
CREATE TABLE IF NOT EXISTS item_expedicao (
    fk_expedicao_id_expedicao INTEGER NOT NULL,
    fk_produto_codigo_barras TEXT NOT NULL,
    quantidade_expedida INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (fk_expedicao_id_expedicao, fk_produto_codigo_barras),
    FOREIGN KEY (fk_expedicao_id_expedicao) REFERENCES expedicao(id_expedicao),
    FOREIGN KEY (fk_produto_codigo_barras) REFERENCES produto(codigo_barras)
);
"""

conferencia_retorno_table = """
CREATE TABLE IF NOT EXISTS conferencia_retorno (
    id_conferencia INTEGER PRIMARY KEY AUTOINCREMENT,
    data_hora_conferencia TEXT NOT NULL,
    fk_expedicao_id_expedicao INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (fk_expedicao_id_expedicao) REFERENCES expedicao(id_expedicao)
);
"""

venda_table = """
CREATE TABLE IF NOT EXISTS venda (
    id_venda INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_venda TEXT,
    data_venda TEXT NOT NULL,
    fk_rota_id_rota INTEGER NOT NULL,
    fk_vendedor_cpf TEXT NOT NULL,
    fk_cliente_id_cliente INTEGER,
    status_venda TEXT NOT NULL DEFAULT 'aberta',
    FOREIGN KEY (fk_rota_id_rota) REFERENCES rota(id_rota),
    FOREIGN KEY (fk_vendedor_cpf) REFERENCES vendedor(cpf),
    FOREIGN KEY (fk_cliente_id_cliente) REFERENCES cliente(id_cliente)
);
"""

item_venda_table = """
CREATE TABLE IF NOT EXISTS item_venda (
    fk_venda_id_venda INTEGER NOT NULL,
    fk_produto_codigo_barras TEXT NOT NULL,
    quantidade_vendida INTEGER NOT NULL DEFAULT 0,
    preco_unitario_venda REAL NOT NULL,
    PRIMARY KEY (fk_venda_id_venda, fk_produto_codigo_barras),
    FOREIGN KEY (fk_venda_id_venda) REFERENCES venda(id_venda),
    FOREIGN KEY (fk_produto_codigo_barras) REFERENCES produto(codigo_barras)
);
"""

financas_table = """
CREATE TABLE IF NOT EXISTS financas (
    id_movimentacao INTEGER PRIMARY KEY AUTOINCREMENT,
    data_movimentacao TEXT NOT NULL,
    tipo_movimentacao TEXT NOT NULL,
    valor REAL NOT NULL,
    descricao TEXT,
    mes_referencia TEXT
);
"""

view_total_vendas_por_vendedor = """
CREATE VIEW IF NOT EXISTS TotalVendasPorVendedor AS
SELECT 
    v.cpf,
    SUM(iv.quantidade_vendida * iv.preco_unitario_venda) AS valor_total
FROM 
    vendedor v
JOIN 
    venda ve ON ve.fk_vendedor_cpf = v.cpf
JOIN 
    item_venda iv ON iv.fk_venda_id_venda = ve.id_venda
GROUP BY 
    v.cpf;
"""

view_quantidade_produto_por_fornecedor = """
CREATE VIEW IF NOT EXISTS QuantidadeProdutoPorFornecedor AS
SELECT 
    f.cnpj,
    COUNT(p.codigo_barras) AS total_produtos
FROM 
    fornecedor f
LEFT JOIN 
    produto p ON p.fk_fornecedor_cnpj = f.cnpj
GROUP BY 
    f.cnpj;
"""

tables = [
    fornecedor_table, produto_table, vendedor_table, carro_venda_table,
    rota_table, cliente_table, expedicao_table, item_expedicao_table,
    conferencia_retorno_table, venda_table, item_venda_table, financas_table
]

views = [view_total_vendas_por_vendedor, view_quantidade_produto_por_fornecedor]
