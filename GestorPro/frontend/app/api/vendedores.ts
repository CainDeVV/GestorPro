import { Vendor } from '../../types';
import { apiFetch } from './config';

// --- FUNÇÕES DE VENDEDORES ---
export const getVendors = () => apiFetch<Vendor[]>('/vendedores/');

export const getVendorByCpf = (cpf: string) => apiFetch<Vendor>(`/vendedores/${cpf}`);

export const addVendor = (vendorData: Vendor) => {
  console.log('Dados do vendedor sendo enviados:', vendorData);
  return apiFetch<Vendor>('/vendedores/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vendorData),
  });
};

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