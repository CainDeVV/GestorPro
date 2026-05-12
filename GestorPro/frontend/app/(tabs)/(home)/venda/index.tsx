import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Venda } from '../../../../types';
import { getVendas } from '../../../../services/api';

export default function VendasScreen() {
  const router = useRouter();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVendas();
  }, []);

  const loadVendas = async () => {
    try {
      setIsLoading(true);
      const data = await getVendas();
      setVendas(data);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao carregar vendas"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderVenda = ({ item }: { item: Venda }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: "/venda/[id]",
        params: { id: item.id_venda.toString() }
      })}
      className="bg-white p-4 rounded-lg mb-2 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex flex-row items-center justify-between mx-5">
          <div className="flex flex-col">
            <Text className="text-lg font-semibold text-gray-800">
              {item.nome_venda} #{item.id_venda}
            </Text>
            <Text className="text-gray-600">📅 {formatDate(item.data_venda)}</Text>
            {item.nome_vendedor && (
              <Text className="text-gray-600">👤 Vendedor: {item.nome_vendedor}</Text>
            )}
            {item.nome_cliente && (
              <Text className="text-gray-600">👥 Cliente: {item.nome_cliente}</Text>
            )}
            {item.nome_rota && (
              <Text className="text-gray-600">🗺️ Rota: {item.nome_rota}</Text>
            )}
            <Text className={`font-semibold ${item.status_venda === 'aberta' ? 'text-green-600' : 'text-red-600'
              }`}>
              {item.status_venda === 'aberta' ? '🟢 Aberta' : '🔴 Fechada'}
            </Text>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {item.valor_total !== undefined && (
              <Text className="text-xl font-bold text-blue-600 mt-1">
                💰 R$ {item.valor_total.toFixed(2).replace('.', ',')}
              </Text>
            )}
          </div>
        </View>
        <FontAwesome name="chevron-right" size={16} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Carregando vendas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Vendas Registradas</Text>
          <TouchableOpacity
            onPress={() => router.push('/venda/nova-venda')}
            className="bg-green-600 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-semibold">Nova Venda</Text>
          </TouchableOpacity>
        </View>

        {vendas.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <FontAwesome name="shopping-cart" size={64} color="#9ca3af" />
            <Text className="text-lg text-gray-600 mt-4">Nenhuma venda registrada</Text>
            <Text className="text-gray-500 text-center mt-2">
              Registre sua primeira venda para começar
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/venda/nova-venda')}
              className="mt-4 bg-green-600 px-6 py-3 rounded-md"
            >
              <Text className="text-white font-semibold">Registrar Primeira Venda</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={vendas}
            keyExtractor={(item) => item.id_venda.toString()}
            renderItem={renderVenda}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={loadVendas}
          />
        )}
      </View>
    </SafeAreaView>
  );
}