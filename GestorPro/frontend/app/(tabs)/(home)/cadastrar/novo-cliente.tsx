import { addCliente } from '../../../../services/api';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NovoClienteScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome do cliente é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      await addCliente({
        nome: nome.trim(),
        endereco: endereco.trim() || undefined,
        telefone: telefone.trim() || undefined,
        cpf_cnpj: cpfCnpj.trim() || undefined,
      });

      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao cadastrar cliente'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Novo Cliente</Text>
          <Text className="text-gray-600">Cadastre as informações do cliente</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-base text-gray-700 mb-1">Nome *</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              className="border border-gray-300 bg-white p-3 rounded-md text-base"
              placeholder="Nome completo do cliente"
            />
          </View>

          <View>
            <Text className="text-base text-gray-700 mb-1">Endereço</Text>
            <TextInput
              value={endereco}
              onChangeText={setEndereco}
              className="border border-gray-300 bg-white p-3 rounded-md text-base"
              placeholder="Endereço completo"
              multiline
            />
          </View>

          <View>
            <Text className="text-base text-gray-700 mb-1">Telefone</Text>
            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              className="border border-gray-300 bg-white p-3 rounded-md text-base"
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-base text-gray-700 mb-1">CPF/CNPJ</Text>
            <TextInput
              value={cpfCnpj}
              onChangeText={setCpfCnpj}
              className="border border-gray-300 bg-white p-3 rounded-md text-base"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
          </View>
        </View>

        <View className="mt-8 space-y-3">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`py-4 rounded-md items-center ${isLoading ? 'bg-gray-400' : 'bg-green-600'}`}
          >
            <Text className="text-white text-lg font-bold">
              {isLoading ? 'Salvando...' : 'Salvar Cliente'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isLoading}
            className="py-4 rounded-md items-center border border-gray-300"
          >
            <Text className="text-gray-700 text-lg">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 