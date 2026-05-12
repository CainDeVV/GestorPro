import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useSale } from '../../../../../context/SaleContext';
import { Cliente } from '../../../../../types';
import { getClientes } from '../../../../../services/api';

export default function SelecionarClienteScreen() {
  const router = useRouter();
  const { setClienteForSale } = useSale();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setIsLoading(true);
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Alert.alert(
        "Erro", 
        error instanceof Error ? error.message : "Erro ao carregar clientes"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setClienteForSale(cliente);
    router.back();
  };

  const renderCliente = ({ item }: { item: Cliente }) => (
    <TouchableOpacity
      onPress={() => handleSelectCliente(item)}
      className="bg-white p-4 rounded-lg mb-2 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{item.nome}</Text>
          {item.telefone && (
            <Text className="text-gray-600">📞 {item.telefone}</Text>
          )}
          {item.endereco && (
            <Text className="text-gray-600">📍 {item.endereco}</Text>
          )}
          {item.cpf_cnpj && (
            <Text className="text-gray-600">📄 {item.cpf_cnpj}</Text>
          )}
        </View>
        <FontAwesome name="chevron-right" size={16} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Carregando clientes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Selecionar Cliente</Text>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/(home)/cadastrar/novo-cliente')}
            className="bg-blue-600 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-semibold">Novo Cliente</Text>
          </TouchableOpacity>
        </View>
        
        {clientes.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <FontAwesome name="users" size={64} color="#9ca3af" />
            <Text className="text-lg text-gray-600 mt-4">Nenhum cliente cadastrado</Text>
            <Text className="text-gray-500 text-center mt-2">
              Cadastre clientes no sistema para poder selecioná-los nas vendas
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/(home)/cadastrar/novo-cliente')}
              className="mt-4 bg-blue-600 px-6 py-3 rounded-md"
            >
              <Text className="text-white font-semibold">Cadastrar Primeiro Cliente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id_cliente?.toString() || item.nome}
            renderItem={renderCliente}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
} 