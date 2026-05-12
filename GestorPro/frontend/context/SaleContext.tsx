import React, { createContext, ReactNode, useContext, useState } from 'react';

// 1. A importação foi corrigida para usar 'types/index.ts'
import { Product, Route, Sale, Vendor, Cliente, SaleProduct } from '../types';

// O restante das interfaces (SaleState, SaleContextType) não muda,
// mas agora elas usam os tipos corretos importados acima.
interface SaleState {
  id: string | null;
  nome: string;
  produtos: SaleProduct[];
  vendedor: Vendor | null;
  rota: Route | null;
  cliente: Cliente | null;
  total: number;
}
interface SaleContextType {
  currentSale: Sale | null;
  savedSales: Sale[];
  startNewSale: (nome: string) => void;
  updateSaleName: (newName: string) => void;
  addProductToSale: (product: Product, quantidade?: number) => void;
  updateProductQuantity: (productId: string, quantidade: number) => void;
  removeProductFromSale: (productId: string | number) => void;
  setVendorForSale: (vendor: Vendor) => void;
  setRouteForSale: (route: Route) => void;
  setClienteForSale: (cliente: Cliente) => void;
  saveCurrentSale: () => void;
  deleteSavedSales: (saleIds: (string | number)[]) => void;
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

export const SaleProvider = ({ children }: { children: ReactNode }) => {
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [savedSales, setSavedSales] = useState<Sale[]>([]); // Inicia com lista vazia

  const startNewSale = (nome: string) => {
    setCurrentSale({
      id: Date.now().toString(),
      nome,
      produtos: [],
      vendedor: null,
      rota: null,
      cliente: null,
      total: 0,
    });
  };

  const updateSaleName = (newName: string) => {
    if (!currentSale) return;
    setCurrentSale({ ...currentSale, nome: newName });
  };

  const addProductToSale = (product: Product, quantidade: number = 1) => {
    if (!currentSale) return;
    
    // Verifica se o produto já existe na venda
    const existingProductIndex = currentSale.produtos.findIndex(
      sp => sp.produto.codigo_barras === product.codigo_barras
    );

    let newProducts: SaleProduct[];
    
    if (existingProductIndex >= 0) {
      // Se o produto já existe, apenas atualiza a quantidade
      newProducts = [...currentSale.produtos];
      newProducts[existingProductIndex] = {
        ...newProducts[existingProductIndex],
        quantidade: newProducts[existingProductIndex].quantidade + quantidade
      };
    } else {
      // Se o produto não existe, adiciona novo
      const saleProduct: SaleProduct = {
        produto: product,
        quantidade: quantidade,
        preco_unitario: product.preco_venda || 0
      };
      newProducts = [...currentSale.produtos, saleProduct];
    }

    // Calcula o novo total
    const newTotal = newProducts.reduce((sum, sp) => 
      sum + (sp.preco_unitario * sp.quantidade), 0
    );
    
    setCurrentSale({ ...currentSale, produtos: newProducts, total: newTotal });
  };

  const updateProductQuantity = (productId: string, quantidade: number) => {
    if (!currentSale) return;
    
    const newProducts = currentSale.produtos.map(sp => {
      if (sp.produto.codigo_barras === productId) {
        return { ...sp, quantidade: Math.max(0, quantidade) };
      }
      return sp;
    }).filter(sp => sp.quantidade > 0); // Remove produtos com quantidade 0

    // Calcula o novo total
    const newTotal = newProducts.reduce((sum, sp) => 
      sum + (sp.preco_unitario * sp.quantidade), 0
    );
    
    setCurrentSale({ ...currentSale, produtos: newProducts, total: newTotal });
  };
  
  const removeProductFromSale = (productId: string | number) => {
    if (!currentSale) return;
    const newProducts = currentSale.produtos.filter(sp => sp.produto.codigo_barras !== productId);
    // Calcula o novo total
    const newTotal = newProducts.reduce((sum, sp) => 
      sum + (sp.preco_unitario * sp.quantidade), 0
    );
    setCurrentSale({ ...currentSale, produtos: newProducts, total: newTotal });
  };

  const setVendorForSale = (vendor: Vendor) => {
    if (!currentSale) return;
    setCurrentSale({ ...currentSale, vendedor: vendor });
  };

  const setRouteForSale = (route: Route) => {
    if (!currentSale) return;
    setCurrentSale({ ...currentSale, rota: route });
  };

  const setClienteForSale = (cliente: Cliente) => {
    if (!currentSale) return;
    setCurrentSale({ ...currentSale, cliente: cliente });
  };

  const saveCurrentSale = () => {
    if (!currentSale) return;
    setSavedSales(prevSales => [...prevSales, currentSale]);
    setCurrentSale(null);
  };

  const deleteSavedSales = (saleIds: (string | number)[]) => {
    setSavedSales(prevSales => 
      prevSales.filter(sale => !saleIds.includes(sale.id!))
    );
  };

  return (
    <SaleContext.Provider value={{ 
      currentSale, 
      savedSales,
      startNewSale,
      updateSaleName, 
      addProductToSale,
      updateProductQuantity,
      removeProductFromSale,
      setVendorForSale, 
      setRouteForSale, 
      setClienteForSale,
      saveCurrentSale,
      deleteSavedSales,
    }}>
      {children}
    </SaleContext.Provider>
  );
};

export const useSale = () => {
  const context = useContext(SaleContext);
  if (context === undefined) {
    throw new Error('useSale must be used within a SaleProvider');
  }
  return context;
};