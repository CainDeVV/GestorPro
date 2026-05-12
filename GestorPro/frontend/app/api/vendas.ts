import { VendaCreate, Venda, ItemVendaResponse } from '../../types';
import { apiFetch } from './config';

// --- FUNÇÕES DE VENDAS ---

// Registrar uma nova venda
export const registrarVenda = (vendaData: VendaCreate) => apiFetch<any>('/vendas/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(vendaData),
});

// Listar todas as vendas
export const getVendas = () => apiFetch<Venda[]>('/vendas/');

// Listar vendas abertas
export const getVendasAbertas = () => apiFetch<Venda[]>('/vendas/abertas');

// Buscar venda por ID
export const getVendaById = (id_venda: number) => apiFetch<Venda>(`/vendas/${id_venda}`);

// Buscar itens de uma venda
export const getItensVenda = (id_venda: number) => apiFetch<ItemVendaResponse[]>(`/vendas/${id_venda}/itens`);

// Fechar venda
export const fecharVenda = (id_venda: number) => {
  console.log('=== CHAMANDO fecharVenda ===');
  console.log('ID da venda para fechar:', id_venda);
  console.log('Tipo do ID:', typeof id_venda);
  console.log('URL da requisição:', `/vendas/${id_venda}/fechar`);
  
  return apiFetch<any>(`/vendas/${id_venda}/fechar`, {
    method: 'PUT',
  });
};

// Atualizar venda
export const updateVenda = (id_venda: number, vendaData: Partial<VendaCreate>) => apiFetch<any>(`/vendas/${id_venda}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(vendaData),
});

// Deletar venda
export const deleteVenda = (id_venda: number) => {
  console.log('=== CHAMANDO deleteVenda ===');
  console.log('ID da venda para deletar:', id_venda);
  console.log('Tipo do ID:', typeof id_venda);
  console.log('URL da requisição:', `/vendas/${id_venda}`);
  
  return apiFetch<any>(`/vendas/${id_venda}`, {
    method: 'DELETE',
  });
}; 