import { Product, Route, Vendor, Supplier, Cliente, VendaCreate, Venda, ItemVendaResponse } from '../types';

// ===================================================================
// ATENÇÃO: Lembre-se de substituir 'SEU_IP_AQUI' pelo endereço IP 
// do computador que está rodando o backend! Ex: 'http://192.168.1.10:8000'
// ===================================================================
const BASE_URL = 'http://localhost:8000';

/**
 * Função auxiliar para lidar com as respostas e erros da API de forma padronizada.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro de comunicação com o servidor' }));
    // Lança um erro com a mensagem vinda do backend, ou uma mensagem padrão
    throw new Error(error.detail || 'Ocorreu um erro no servidor');
  }
  return response.json();
}

/**
 * Função genérica para fazer as chamadas fetch para a nossa API.
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response);
  } catch (error) {
    // Captura erros de rede (ex: servidor offline)
    console.error('API Fetch Error:', error);
    throw new Error('Não foi possível conectar ao servidor. Verifique o endereço IP e a rede.');
  }
}

// --- FUNÇÕES DE PRODUTOS ---
export const getProducts = () => apiFetch<Product[]>('/produtos/');
export const getProductById = (codigo_barras: string) => apiFetch<Product>(`/produtos/${codigo_barras}`);
export const addProduct = (productData: Product) => {
  console.log('=== addProduct chamada ===');
  console.log('URL:', `${BASE_URL}/produtos/`);
  console.log('Dados:', productData);
  return apiFetch<Product>('/produtos/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
};
export const updateProduct = (codigo_barras: string, productData: Product) => apiFetch<Product>(`/produtos/${codigo_barras}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData),
});
// Função para deletar um produto individual
export const deleteProduct = (codigo_barras: string) => apiFetch<any>(`/produtos/${codigo_barras}`, {
  method: 'DELETE',
});

// Função para deletar múltiplos produtos - deleta um por um
export const deleteProducts = async (codigos: (string | number)[]) => {
  const results = await Promise.allSettled(
    codigos.map(codigo => deleteProduct(codigo.toString()))
  );
  
  // Verifica se houve algum erro
  const errors = results
    .map((result, index) => result.status === 'rejected' ? codigos[index] : null)
    .filter(Boolean);
  
  if (errors.length > 0) {
    throw new Error(`Erro ao deletar produtos: ${errors.join(', ')}`);
  }
  
  return results;
};

// --- FUNÇÕES DE VENDEDORES ---
export const getVendors = () => apiFetch<Vendor[]>('/vendedores/');
export const getVendorByCpf = (cpf: string) => apiFetch<Vendor>(`/vendedores/${cpf}`);
export const addVendor = (vendorData: Vendor) => apiFetch<Vendor>('/vendedores/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(vendorData),
});
export const updateVendor = (cpf: string, vendorData: Vendor) => apiFetch<Vendor>(`/vendedores/${cpf}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(vendorData),
});
// Função para deletar um vendedor individual
export const deleteVendor = (cpf: string) => apiFetch<any>(`/vendedores/${cpf}`, {
  method: 'DELETE',
});

// Função para deletar múltiplos vendedores - deleta um por um
export const deleteVendors = async (cpfs: (string | number)[]) => {
  const results = await Promise.allSettled(
    cpfs.map(cpf => deleteVendor(cpf.toString()))
  );
  
  // Verifica se houve algum erro
  const errors = results
    .map((result, index) => result.status === 'rejected' ? cpfs[index] : null)
    .filter(Boolean);
  
  if (errors.length > 0) {
    throw new Error(`Erro ao deletar vendedores: ${errors.join(', ')}`);
  }
  
  return results;
};

// --- FUNÇÕES DE CLIENTES ---
export const getClientes = () => apiFetch<Cliente[]>('/clientes/');
export const getClienteById = (id_cliente: number) => apiFetch<Cliente>(`/clientes/${id_cliente}`);
export const addCliente = (clienteData: Omit<Cliente, 'id_cliente'>) => apiFetch<Cliente>('/clientes/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(clienteData),
});
export const updateCliente = (id_cliente: number, clienteData: Partial<Cliente>) => apiFetch<Cliente>(`/clientes/${id_cliente}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(clienteData),
});
export const deleteCliente = (id_cliente: number) => apiFetch<any>(`/clientes/${id_cliente}`, {
  method: 'DELETE',
});
export const deleteClientes = async (ids: (string | number)[]) => {
  const results = await Promise.allSettled(
    ids.map(id => deleteCliente(Number(id)))
  );
  
  const errors = results
    .map((result, index) => result.status === 'rejected' ? ids[index] : null)
    .filter(Boolean);
  
  if (errors.length > 0) {
    throw new Error(`Erro ao deletar clientes: ${errors.join(', ')}`);
  }
  
  return results;
};

// --- FUNÇÕES DE VENDAS ---
export const registrarVenda = (vendaData: VendaCreate) => apiFetch<any>('/vendas/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(vendaData),
});
export const getVendas = () => apiFetch<Venda[]>('/vendas/');
export const getVendasAbertas = () => apiFetch<Venda[]>('/vendas/abertas');
export const getVendaById = (id_venda: number) => apiFetch<Venda>(`/vendas/${id_venda}`);
export const getItensVenda = (id_venda: number) => apiFetch<ItemVendaResponse[]>(`/vendas/${id_venda}/itens`);
export const fecharVenda = (id_venda: number) => apiFetch<any>(`/vendas/${id_venda}/fechar`, {
  method: 'PUT',
});
export const updateVenda = (id_venda: number, vendaData: Partial<VendaCreate>) => apiFetch<any>(`/vendas/${id_venda}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(vendaData),
});
export const deleteVenda = (id_venda: number) => apiFetch<any>(`/vendas/${id_venda}`, {
  method: 'DELETE',
});

// --- FUNÇÕES DE FORNECEDORES ---
export const getSuppliers = () => apiFetch<Supplier[]>('/fornecedores/');
export const getSupplierByCnpj = (cnpj: string) => apiFetch<Supplier>(`/fornecedores/${cnpj}`);
export const addSupplier = (supplierData: Supplier) => apiFetch<Supplier>('/fornecedores/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(supplierData),
});
export const updateSupplier = (cnpj: string, supplierData: Supplier) => apiFetch<Supplier>(`/fornecedores/${cnpj}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(supplierData),
});
export const deleteSupplier = (cnpj: string) => apiFetch<any>(`/fornecedores/${cnpj}`, {
  method: 'DELETE',
});

// --- FUNÇÕES DE ROTAS ---
export const getRoutes = () => apiFetch<Route[]>('/rotas/');
export const getRouteById = (id_rota: number) => apiFetch<Route>(`/rotas/${id_rota}`);
export const addRoute = (routeData: Omit<Route, 'id_rota'>) => apiFetch<Route>('/rotas/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(routeData),
});
export const updateRoute = (id_rota: number, routeData: Omit<Route, 'id_rota'>) => apiFetch<Route>(`/rotas/${id_rota}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(routeData),
});
// Função para deletar uma rota individual
export const deleteRoute = (id_rota: number) => apiFetch<any>(`/rotas/${id_rota}`, {
  method: 'DELETE',
});

// Função para deletar múltiplas rotas - deleta uma por uma
export const deleteRoutes = async (ids: (string | number)[]) => {
  const results = await Promise.allSettled(
    ids.map(id => deleteRoute(Number(id)))
  );
  
  // Verifica se houve algum erro
  const errors = results
    .map((result, index) => result.status === 'rejected' ? ids[index] : null)
    .filter(Boolean);
  
  if (errors.length > 0) {
    throw new Error(`Erro ao deletar rotas: ${errors.join(', ')}`);
  }
  
  return results;
};

// Exportar BASE_URL para uso em outros arquivos
// --- FUNÇÕES DE RELATÓRIOS E ESTATÍSTICAS ---
export const getProductsLowStock = (limite: number = 10) => apiFetch<Product[]>(`/produtos/estoque/baixo?limite=${limite}`);

// Estatísticas gerais (calculadas no frontend)
export const getEstatisticasGerais = async () => {
  try {
    // Buscar dados de todas as entidades
    const [vendas, vendasAbertas, produtos, clientes, vendedores, fornecedores, rotas] = await Promise.all([
      apiFetch<any[]>('/vendas/'),
      apiFetch<any[]>('/vendas/abertas'),
      apiFetch<any[]>('/produtos/'),
      apiFetch<any[]>('/clientes/'),
      apiFetch<any[]>('/vendedores/'),
      apiFetch<any[]>('/fornecedores/'),
      apiFetch<any[]>('/rotas/')
    ]);

    // Calcular estatísticas
    const totalVendas = vendas.length;
    const vendasPendentes = vendasAbertas.length;
    const totalProdutos = produtos.length;
    const totalClientes = clientes.length;
    const totalVendedores = vendedores.length;
    const totalFornecedores = fornecedores.length;
    const totalRotas = rotas.length;

    // Calcular valores financeiros
    const faturamentoTotal = vendas
      .filter((venda: any) => venda.status_venda === 'fechada')
      .reduce((total: number, venda: any) => total + (venda.valor_total || 0), 0);

    const valorPendente = vendasAbertas
      .reduce((total: number, venda: any) => total + (venda.valor_total || 0), 0);



    // Calcular estoque baixo (produtos com quantidade < 10)
    const produtosEstoqueBaixo = produtos.filter((produto: any) => (produto.quantidade || 0) < 10).length;

    // Calcular produtos sem estoque
    const produtosSemEstoque = produtos.filter((produto: any) => (produto.quantidade || 0) === 0).length;

    return {
      vendas: {
        total: totalVendas,
        pendentes: vendasPendentes,
        fechadas: totalVendas - vendasPendentes
      },
      financeiro: {
        faturamentoTotal,
        valorPendente
      },
      estoque: {
        totalProdutos,
        produtosEstoqueBaixo,
        produtosSemEstoque
      },
      pessoas: {
        totalClientes,
        totalVendedores,
        totalFornecedores
      },
      operacional: {
        totalRotas
      }
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};

export { BASE_URL };