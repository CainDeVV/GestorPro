// Os tipos agora correspondem exatamente às tabelas do banco de dados do backend.

export interface Product {
  codigo_barras: string; // Chave primária
  lote?: string;
  nome: string;
  quantidade: number;
  preco_venda: number | null;
  preco_custo: number | null;
  categoria: string;
  peso: number;
  descricao: string;
  fk_fornecedor_cnpj: string;
  nome_fornecedor?: string; // Nome do fornecedor (pode vir do JOIN)
}

// Nova interface para produtos com quantidade na venda
export interface SaleProduct {
  produto: Product;
  quantidade: number;
  preco_unitario: number;
}

export interface Vendor {
  cpf: string; // Chave primária
  nome: string;
  apelido: string;
  telefone: string;
}

export interface Route {
  id_rota?: number; // Chave primária (opcional para criação)
  nome_rota: string;
  descricao_rota?: string;
}

export interface Supplier {
  cnpj: string; // Chave primária
  nome: string;
  telefone_contato?: string;
  email?: string;
  endereco?: string;
}

export interface Cliente {
  id_cliente?: number; // Chave primária (opcional para criação)
  nome: string;
  endereco?: string;
  telefone?: string;
  cpf_cnpj?: string;
}

export interface Sale {
  id: string;
  nome: string;
  produtos: SaleProduct[]; // Mudança: agora é um array de SaleProduct
  vendedor: Vendor | null;
  rota: Route | null;
  cliente: Cliente | null;
  total: number;
}

// Interface para enviar dados da venda para o backend
export interface VendaCreate {
  fk_rota_id_rota: number;
  fk_vendedor_cpf: string;
  fk_cliente_id_cliente?: number;
  apelido_venda: string; // Adicionar esta propriedade
  itens: ItemVenda[]; // Nova propriedade para os itens da venda
}

// Interface para itens de venda enviados ao backend
export interface ItemVenda {
  fk_produto_codigo_barras: string;
  quantidade_vendida: number;
  preco_unitario_venda: number;
}

// Interface para itens de venda retornados pela API (inclui informações do produto)
export interface ItemVendaResponse {
  fk_venda_id_venda: number;
  fk_produto_codigo_barras: string;
  quantidade_vendida: number;
  preco_unitario_venda: number;
  nome_produto: string;
  preco_venda: number;
}

// Interface para os dados retornados pela API de vendas
export interface Venda {
  id_venda: number;
  data_venda: string;
  fk_rota_id_rota: number;
  fk_vendedor_cpf: string;
  fk_cliente_id_cliente: number | null;
  nome_venda: string | null;
  status_venda: string;
  nome_cliente: string | null;
  nome_vendedor: string | null;
  nome_rota: string | null;
  apelido_venda: string | null; // Adicionar esta propriedade
  valor_total?: number; // Valor total da venda calculado
}