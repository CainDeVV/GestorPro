import { Product } from '../../types';
import { apiFetch } from './config';

// --- FUNÇÕES DE PRODUTOS ---

// Listar todos os produtos
export const getProducts = () => apiFetch<Product[]>('/produtos/');

// Buscar produto por código de barras
export const getProductByBarcode = (codigo_barras: string) => apiFetch<Product>(`/produtos/${codigo_barras}`);

// Criar produto
export const createProduct = (productData: Partial<Product>) => apiFetch<any>('/produtos/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData),
});

// Atualizar produto
export const updateProduct = (codigo_barras: string, productData: Partial<Product>) => apiFetch<any>(`/produtos/${codigo_barras}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData),
});

// Deletar produto
export const deleteProduct = (codigo_barras: string) => apiFetch<any>(`/produtos/${codigo_barras}`, {
  method: 'DELETE',
});

// Buscar produtos com estoque baixo
export const getProductsLowStock = (limite: number = 10) => apiFetch<Product[]>(`/produtos/estoque/baixo?limite=${limite}`);

// Buscar produtos por categoria
export const getProductsByCategory = (categoria: string) => apiFetch<Product[]>(`/produtos/categoria/${categoria}`);

// Buscar produtos por fornecedor
export const getProductsBySupplier = (cnpj: string) => apiFetch<Product[]>(`/produtos/fornecedor/${cnpj}`); 