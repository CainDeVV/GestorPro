import { Supplier } from '../../types';
import { apiFetch } from './config';

// --- FUNÇÕES DE FORNECEDORES ---
export const getSuppliers = () => apiFetch<Supplier[]>('/fornecedores/');

export const getSupplierByCnpj = (cnpj: string) => apiFetch<Supplier>(`/fornecedores/${cnpj}`);

export const addSupplier = (supplierData: Supplier) => {
  console.log('Dados do fornecedor sendo enviados:', supplierData);
  return apiFetch<Supplier>('/fornecedores/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplierData),
  });
};

export const updateSupplier = (cnpj: string, supplierData: Supplier) => apiFetch<Supplier>(`/fornecedores/${cnpj}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(supplierData),
});

// Função para deletar um fornecedor individual
export const deleteSupplier = (cnpj: string) => apiFetch<any>(`/fornecedores/${cnpj}`, {
  method: 'DELETE',
});

// Função para deletar múltiplos fornecedores - deleta um por um
export const deleteSuppliers = async (cnpjs: (string | number)[]) => {
  const results = await Promise.allSettled(
    cnpjs.map(cnpj => deleteSupplier(cnpj.toString()))
  );
  
  // Verifica se houve algum erro
  const errors = results
    .map((result, index) => result.status === 'rejected' ? cnpjs[index] : null)
    .filter(Boolean);
  
  if (errors.length > 0) {
    throw new Error(`Erro ao deletar fornecedores: ${errors.join(', ')}`);
  }
  
  return results;
}; 