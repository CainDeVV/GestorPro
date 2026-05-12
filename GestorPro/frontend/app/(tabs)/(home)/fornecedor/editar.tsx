import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Supplier } from '../../../../types';
import { getSupplierByCnpj, updateSupplier } from '../../../../services/api';

export default function EditarFornecedorScreen() {
  const { cnpj } = useLocalSearchParams<{ cnpj: string }>();
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier>({
    cnpj: '',
    nome: '',
    telefone_contato: '',
    email: '',
    endereco: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    const loadSupplier = async () => {
      if (cnpj) {
        try {
          const data = await getSupplierByCnpj(cnpj);
          setSupplier(data);
        } catch (e) {
          Alert.alert("Erro", "Fornecedor não encontrado.");
          router.back();
        }
      }
    };
    loadSupplier();
  }, [cnpj, router]));

  const handleSave = async () => {
    if (!supplier.nome.trim()) {
      Alert.alert("Erro", "O nome do fornecedor é obrigatório.");
      return;
    }

    setIsLoading(true);
    try {
      await updateSupplier(supplier.cnpj, supplier);
      Alert.alert("Sucesso", "Fornecedor atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar fornecedor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">CNPJ</Text>
            <TextInput
              value={supplier.cnpj}
              editable={false}
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-600"
              placeholder="CNPJ"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Nome *</Text>
            <TextInput
              value={supplier.nome}
              onChangeText={(text) => setSupplier({ ...supplier, nome: text })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Nome do fornecedor"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Telefone</Text>
            <TextInput
              value={supplier.telefone_contato || ''}
              onChangeText={(text) => setSupplier({ ...supplier, telefone_contato: text })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Telefone de contato"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
            <TextInput
              value={supplier.email || ''}
              onChangeText={(text) => setSupplier({ ...supplier, email: text })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Endereço</Text>
            <TextInput
              value={supplier.endereco || ''}
              onChangeText={(text) => setSupplier({ ...supplier, endereco: text })}
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
