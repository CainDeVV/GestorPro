import { apiFetch } from './config';

// --- FUNÇÕES DE RELATÓRIOS E ESTATÍSTICAS ---

// Relatórios de vendas
export const getVendasPorVendedor = () => apiFetch<any[]>('/relatorios/vendas-por-vendedor');

export const getTotalVendasPorVendedor = () => apiFetch<any>('/relatorios/total_vendas_por_vendedor');

// Relatórios de produtos
export const getProdutosPorFornecedor = () => apiFetch<any[]>('/relatorios/produtos-por-fornecedor');

export const getQuantidadeProdutoPorFornecedor = () => apiFetch<any>('/relatorios/quantidade_produto_por_fornecedor');

// --- RELATÓRIOS ESPECÍFICOS POR ENTIDADE ---

// Relatório de Vendas
export const getRelatorioVendas = async () => {
  try {
    const vendas = await apiFetch<any[]>('/vendas/');
    
    const contagemVendas = {
      total: vendas.length,
      porStatus: {
        fechadas: vendas.filter((venda: any) => venda.status_venda === 'fechada').length,
        abertas: vendas.filter((venda: any) => venda.status_venda === 'aberta').length,
        canceladas: vendas.filter((venda: any) => venda.status_venda === 'cancelada').length
      },
      porVendedor: {} as Record<string, number>,
      porRota: {} as Record<number, number>,
      porCliente: {} as Record<number, number>
    };

    // Contagem por vendedor
    vendas.forEach((venda: any) => {
      const vendedor = venda.fk_vendedor_cpf;
      contagemVendas.porVendedor[vendedor] = (contagemVendas.porVendedor[vendedor] || 0) + 1;
    });

    // Contagem por rota
    vendas.forEach((venda: any) => {
      const rota = venda.fk_rota_id_rota;
      contagemVendas.porRota[rota] = (contagemVendas.porRota[rota] || 0) + 1;
    });

    // Contagem por cliente
    vendas.forEach((venda: any) => {
      const cliente = venda.fk_cliente_id_cliente;
      contagemVendas.porCliente[cliente] = (contagemVendas.porCliente[cliente] || 0) + 1;
    });

    return contagemVendas;
  } catch (error) {
    console.error('Erro ao buscar relatório de vendas:', error);
    throw error;
  }
};

// Relatório de Produtos
export const getRelatorioProdutos = async () => {
  try {
    const produtos = await apiFetch<any[]>('/produtos/');
    
    const contagemProdutos = {
      total: produtos.length,
      porFornecedor: {} as Record<string, number>,
      porCategoria: {} as Record<string, number>,
      estoque: {
        total: produtos.reduce((total: number, produto: any) => total + (produto.quantidade || 0), 0),
        baixo: produtos.filter((produto: any) => (produto.quantidade || 0) < 10).length,
        semEstoque: produtos.filter((produto: any) => (produto.quantidade || 0) === 0).length
      },
      valorTotal: produtos.reduce((total: number, produto: any) => {
        return total + ((produto.preco_venda || 0) * (produto.quantidade || 0));
      }, 0)
    };

    // Contagem por fornecedor
    produtos.forEach((produto: any) => {
      const fornecedor = produto.fk_fornecedor_cnpj;
      contagemProdutos.porFornecedor[fornecedor] = (contagemProdutos.porFornecedor[fornecedor] || 0) + 1;
    });

    // Contagem por categoria
    produtos.forEach((produto: any) => {
      const categoria = produto.categoria || 'Sem categoria';
      contagemProdutos.porCategoria[categoria] = (contagemProdutos.porCategoria[categoria] || 0) + 1;
    });

    return contagemProdutos;
  } catch (error) {
    console.error('Erro ao buscar relatório de produtos:', error);
    throw error;
  }
};

// Relatório de Clientes
export const getRelatorioClientes = async () => {
  try {
    const clientes = await apiFetch<any[]>('/clientes/');
    
    const contagemClientes = {
      total: clientes.length,
      comTelefone: clientes.filter((cliente: any) => cliente.telefone && cliente.telefone.trim() !== '').length,
      semTelefone: clientes.filter((cliente: any) => !cliente.telefone || cliente.telefone.trim() === '').length,
      comEndereco: clientes.filter((cliente: any) => cliente.endereco && cliente.endereco.trim() !== '').length,
      semEndereco: clientes.filter((cliente: any) => !cliente.endereco || cliente.endereco.trim() === '').length
    };

    return contagemClientes;
  } catch (error) {
    console.error('Erro ao buscar relatório de clientes:', error);
    throw error;
  }
};

// Relatório de Vendedores
export const getRelatorioVendedores = async () => {
  try {
    const vendedores = await apiFetch<any[]>('/vendedores/');
    
    const contagemVendedores = {
      total: vendedores.length,
      comApelido: vendedores.filter((vendedor: any) => vendedor.apelido && vendedor.apelido.trim() !== '').length,
      semApelido: vendedores.filter((vendedor: any) => !vendedor.apelido || vendedor.apelido.trim() === '').length,
      comTelefone: vendedores.filter((vendedor: any) => vendedor.telefone && vendedor.telefone.trim() !== '').length,
      semTelefone: vendedores.filter((vendedor: any) => !vendedor.telefone || vendedor.telefone.trim() === '').length
    };

    return contagemVendedores;
  } catch (error) {
    console.error('Erro ao buscar relatório de vendedores:', error);
    throw error;
  }
};

// Relatório de Fornecedores
export const getRelatorioFornecedores = async () => {
  try {
    const fornecedores = await apiFetch<any[]>('/fornecedores/');
    
    const contagemFornecedores = {
      total: fornecedores.length,
      completos: fornecedores.filter((fornecedor: any) => 
        fornecedor.nome && fornecedor.endereco && fornecedor.telefone_contato && fornecedor.email
      ).length,
      incompletos: fornecedores.filter((fornecedor: any) => 
        !fornecedor.nome || !fornecedor.endereco || !fornecedor.telefone_contato || !fornecedor.email
      ).length,
      porCampo: {
        comNome: fornecedores.filter((f: any) => f.nome && f.nome.trim() !== '').length,
        comEndereco: fornecedores.filter((f: any) => f.endereco && f.endereco.trim() !== '').length,
        comTelefone: fornecedores.filter((f: any) => f.telefone_contato && f.telefone_contato.trim() !== '').length,
        comEmail: fornecedores.filter((f: any) => f.email && f.email.trim() !== '').length
      }
    };

    return contagemFornecedores;
  } catch (error) {
    console.error('Erro ao buscar relatório de fornecedores:', error);
    throw error;
  }
};

// Relatório de Rotas
export const getRelatorioRotas = async () => {
  try {
    const rotas = await apiFetch<any[]>('/rotas/');
    
    const contagemRotas = {
      total: rotas.length,
      comDescricao: rotas.filter((rota: any) => rota.descricao_rota && rota.descricao_rota.trim() !== '').length,
      semDescricao: rotas.filter((rota: any) => !rota.descricao_rota || rota.descricao_rota.trim() === '').length
    };

    return contagemRotas;
  } catch (error) {
    console.error('Erro ao buscar relatório de rotas:', error);
    throw error;
  }
};

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
