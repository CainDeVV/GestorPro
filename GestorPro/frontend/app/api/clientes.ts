import { Cliente } from '../../types';
import { apiFetch } from './config';

// --- FUNÇÕES DE CLIENTES ---

// Listar todos os clientes
export const getClientes = () => apiFetch<Cliente[]>('/clientes/');

// Buscar cliente por ID
export const getClienteById = (id_cliente: number) => apiFetch<Cliente>(`/clientes/${id_cliente}`);

// Cadastrar novo cliente
export const addCliente = (clienteData: Omit<Cliente, 'id_cliente'>) => apiFetch<Cliente>('/clientes/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(clienteData),
});

// Atualizar cliente
export const updateCliente = (id_cliente: number, clienteData: Partial<Cliente>) => apiFetch<Cliente>(`/clientes/${id_cliente}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(clienteData),
});

// Deletar cliente
export const deleteCliente = (id_cliente: number) => apiFetch<any>(`/clientes/${id_cliente}`, {
  method: 'DELETE',
});

// Função para deletar múltiplos clientes - deleta um por um
export const deleteClientes = async (ids: (string | number)[]) => {
  const results = await Promise.allSettled(
    ids.map(id => deleteCliente(Number(id)))
  );
  
  // Verifica se houve algum erro
  const errors = results
    .map((result, index) => result.status === 'rejected' ? ids[index] : null)
    .filter(Boolean);
  
  if (errors.length > 0) {
    throw new Error(`Erro ao deletar clientes: ${errors.join(', ')}`);
  }
  
  return results;
}; 