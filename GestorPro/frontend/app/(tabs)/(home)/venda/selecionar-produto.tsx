import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSale } from '../../../../context/SaleContext';
import { getProducts } from '../../../../services/api';
import { Product } from '../../../../types';
import QuantityModal from '../../../../components/QuantityModal';

export default function SelecionarProdutoScreen() {
  const router = useRouter();
  const { addProductToSale, currentSale } = useSale();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  // Busca os produtos da API quando a tela foca
  useFocusEffect(useCallback(() => {
    const loadData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch(e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    loadData();
  }, []));

  const handleAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = (quantity: number) => {
    if (selectedProduct) {
      addProductToSale(selectedProduct, quantity);
      setShowQuantityModal(false);
      setSelectedProduct(null);
      // Volta para a página de nova venda após adicionar o produto
      router.back();
    }
  };

  const handleCancelQuantity = () => {
    setShowQuantityModal(false);
    setSelectedProduct(null);
  };

  const isProductInSale = (product: Product) => {
    return currentSale?.produtos.some(sp => sp.produto.codigo_barras === product.codigo_barras) || false;
  };

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={products}
        keyExtractor={(item) => item.codigo_barras}
        className="p-4"
        renderItem={({ item }) => {
          const isAdded = isProductInSale(item);
          return (
            <View className="bg-white p-3 rounded-lg shadow-sm mb-3 flex-row items-center">
              <View className="flex-1">
                <Text className="font-bold">{item.nome}</Text>
                <Text className="text-gray-600">R$ {item.preco_venda?.toFixed(2).replace('.', ',') || '0,00'}</Text>
                <Text className="text-gray-500 text-sm">Estoque: {item.quantidade} unidades</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleAddProduct(item)}
                disabled={isAdded}
                className={`py-2 px-4 rounded-md ${isAdded ? 'bg-gray-300' : 'bg-blue-500'}`}
              >
                <Text className="text-white font-bold">{isAdded ? 'Adicionado' : 'Adicionar'}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <QuantityModal
        visible={showQuantityModal}
        product={selectedProduct}
        onConfirm={handleConfirmQuantity}
        onCancel={handleCancelQuantity}
      />
    </SafeAreaView>
  );
}