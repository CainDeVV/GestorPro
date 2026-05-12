import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSale } from '../../../../context/SaleContext';
import { Sale, VendaCreate, ItemVenda } from '../../../../types';
import { registrarVenda } from '../../../../services/api';
import QuantityModal from '../../../../components/QuantityModal';

interface ListHeaderProps {
  currentSale: Sale;
  onNameChange: (text: string) => void;
}

const ListHeader = ({ currentSale, onNameChange }: ListHeaderProps) => (
  <View>
    <Text className="text-base text-gray-600 mb-1 ml-1">Nome da Venda</Text>
    <TextInput
      value={currentSale.nome}
      onChangeText={onNameChange} // Usa a função recebida por props
      className="border border-gray-300 bg-white p-3 rounded-md text-base mb-6"
      placeholder="Ex: Venda para Cliente X"
    />

    <View className="flex-row justify-around mb-6">
      <Link href="/venda/selecionar-produto" asChild><TouchableOpacity className="items-center p-2"><FontAwesome name="cube" size={32} /><Text className="mt-1">Produtos</Text></TouchableOpacity></Link>
      <Link href="/venda/selecionar-vendedor" asChild><TouchableOpacity className="items-center p-2"><FontAwesome name="user" size={32} /><Text className="mt-1">Vendedor</Text></TouchableOpacity></Link>
      <Link href="/venda/selecionar-rota" asChild><TouchableOpacity className="items-center p-2"><FontAwesome name="map-marker" size={32} /><Text className="mt-1">Rota</Text></TouchableOpacity></Link>
      <Link href="/venda/selecionar-cliente" asChild><TouchableOpacity className="items-center p-2"><FontAwesome name="users" size={32} /><Text className="mt-1">Cliente</Text></TouchableOpacity></Link>
    </View>

    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <Text className="text-gray-700">Vendedor: <Text className="font-semibold">{currentSale.vendedor?.nome || 'Nenhum'}</Text></Text>
      <Text className="text-gray-700">Rota: <Text className="font-semibold">{currentSale.rota?.nome_rota || 'Nenhuma'}</Text></Text>
      <Text className="text-gray-700">Cliente: <Text className="font-semibold">{currentSale.cliente?.nome || 'Nenhum'}</Text></Text>
    </View>

    <Text className="text-lg font-bold mb-2">Produtos na Venda ({currentSale.produtos.length})</Text>
  </View>
);

// --- 2. MOVEMOS O ListFooter PARA FORA ---
interface ListFooterProps {
  currentSale: Sale;
  onSave: () => void;
  isLoading: boolean;
}

const ListFooter = ({ currentSale, onSave, isLoading }: ListFooterProps) => (
  <View className="mt-6">
    <Text className="text-2xl font-bold text-right mb-4">Total: R$ {currentSale.total.toFixed(2).replace('.', ',')}</Text>
    <TouchableOpacity 
      onPress={onSave} 
      disabled={isLoading}
      className={`py-4 rounded-md items-center ${isLoading ? 'bg-gray-400' : 'bg-green-600'}`}
    >
      <Text className="text-white text-lg font-bold">
        {isLoading ? 'Salvando...' : 'Salvar Venda'}
      </Text>
    </TouchableOpacity>
  </View>
);

// --- 3. A TELA PRINCIPAL AGORA APENAS GERENCIA A LÓGICA ---
export default function NovaVendaScreen() {
  const router = useRouter();
  const { currentSale, startNewSale, updateSaleName, removeProductFromSale, updateProductQuantity, saveCurrentSale } = useSale();
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  useEffect(() => {
    if (!currentSale) {
      startNewSale('Venda Rascunho'); 
    }
  }, [currentSale]);

  const handleEditQuantity = (productId: string) => {
    setEditingProduct(productId);
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = (quantity: number) => {
    if (editingProduct) {
      updateProductQuantity(editingProduct, quantity);
      setShowQuantityModal(false);
      setEditingProduct(null);
    }
  };

  const handleCancelQuantity = () => {
    setShowQuantityModal(false);
    setEditingProduct(null);
  };

  const getEditingProduct = () => {
    if (!editingProduct || !currentSale) return null;
    const saleProduct = currentSale.produtos.find(sp => sp.produto.codigo_barras === editingProduct);
    return saleProduct ? saleProduct.produto : null;
  };

  const handleSaveSale = async () => {
    if (!currentSale) return;

    // Validações básicas
    if (!currentSale.vendedor) {
      Alert.alert("Erro", "Selecione um vendedor antes de salvar a venda.");
      return;
    }

    if (!currentSale.rota) {
      Alert.alert("Erro", "Selecione uma rota antes de salvar a venda.");
      return;
    }

    if (currentSale.produtos.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos um produto antes de salvar a venda.");
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para enviar ao backend
      const vendaData: VendaCreate = {
        fk_rota_id_rota: currentSale.rota.id_rota!,
        fk_vendedor_cpf: currentSale.vendedor.cpf,
        fk_cliente_id_cliente: currentSale.cliente?.id_cliente,
        itens: currentSale.produtos.map(sp => ({
          fk_produto_codigo_barras: sp.produto.codigo_barras,
          quantidade_vendida: sp.quantidade,
          preco_unitario_venda: sp.preco_unitario
        }))
      };

      // Enviar para o backend
      await registrarVenda(vendaData);

      Alert.alert("Sucesso", "Venda registrada com sucesso no sistema! Você será redirecionado para fechar vendas.", [
        {
          text: "OK",
          onPress: () => {
            saveCurrentSale();
            router.back();
          }
        }
      ]);
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      Alert.alert(
        "Erro", 
        error instanceof Error ? error.message : "Erro ao salvar a venda. Tente novamente."
      );
    } finally {
      setIsLoading(false);
      router.push('/fechar-venda');
    }
  };

  if (!currentSale) {
    return <View className="flex-1 justify-center items-center"><Text>Iniciando venda...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={currentSale.produtos}
        keyExtractor={(item, index) => `${item.produto.codigo_barras}-${index}`}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-white p-3 rounded mb-2">
            <View className="flex-1">
              <Text className="font-semibold">{item.produto.nome}</Text>
              <Text className="text-gray-600">
                {item.quantidade}x R$ {item.preco_unitario.toFixed(2).replace('.', ',')} = R$ {(item.quantidade * item.preco_unitario).toFixed(2).replace('.', ',')}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleEditQuantity(item.produto.codigo_barras)}
              className="mr-3 p-2 bg-blue-100 rounded"
            >
              <FontAwesome name="edit" size={16} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeProductFromSale(item.produto.codigo_barras)}>
              <FontAwesome name="times-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={<ListHeader currentSale={currentSale} onNameChange={updateSaleName} />}
        ListFooterComponent={<ListFooter currentSale={currentSale} onSave={handleSaveSale} isLoading={isLoading} />}
        contentContainerStyle={{ padding: 16 }}
      />

      <QuantityModal
        visible={showQuantityModal}
        product={getEditingProduct()}
        onConfirm={handleConfirmQuantity}
        onCancel={handleCancelQuantity}
      />
    </SafeAreaView>
  );
}