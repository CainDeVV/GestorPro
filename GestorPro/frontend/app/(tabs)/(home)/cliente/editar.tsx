import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Cliente } from '../../../../types';
import { getClienteById, updateCliente } from '../../../../services/api';

export default function EditarClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente>({
    id_cliente: 0,
    nome: '',
    endereco: '',
    telefone: '',
    cpf_cnpj: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    const loadCliente = async () => {
      if (id) {
        try {
          const data = await getClienteById(Number(id));
          setCliente(data);
        } catch (e) {
          Alert.alert("Erro", "Cliente não encontrado.");
          router.back();
        }
      }
    };
    loadCliente();
  }, [id, router]));

  const handleSave = async () => {
    if (!cliente.nome.trim()) {
      Alert.alert("Erro", "O nome do cliente é obrigatório.");
      return;
    }

    setIsLoading(true);
    try {
      await updateCliente(cliente.id_cliente || 0, cliente);
      Alert.alert("Sucesso", "Cliente atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">ID</Text>
            <TextInput
              value={cliente.id_cliente?.toString() || ''}
              editable={false}
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-600"
              placeholder="ID"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Nome *</Text>
            <TextInput
              value={cliente.nome}
              onChangeText={(text) => setCliente({ ...cliente, nome: text })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Nome do cliente"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">CPF/CNPJ</Text>
            <TextInput
              value={cliente.cpf_cnpj || ''}
              onChangeText={(text) => setCliente({ ...cliente, cpf_cnpj: text })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Telefone</Text>
            <TextInput
              value={cliente.telefone || ''}
              onChangeText={(text) => setCliente({ ...cliente, telefone: text })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Telefone"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Endereço</Text>
            <TextInput
              value={cliente.endereco || ''}
              onChangeText={(text) => setCliente({ ...cliente, endereco: text })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Endereço"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`mt-6 py-3 px-6 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
          >
            <Text className="text-white text-center font-semibold">
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
