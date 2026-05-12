import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { getSuppliers } from '../services/api';
import { Supplier } from '../types';

interface SupplierSelectorProps {
  selectedCnpj: string;
  onSelectSupplier: (cnpj: string) => void;
  label?: string;
}

export default function SupplierSelector({ selectedCnpj, onSelectSupplier, label = "Fornecedor" }: SupplierSelectorProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os fornecedores');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSupplier = suppliers.find(s => s.cnpj === selectedCnpj);

  const handleSelectSupplier = (supplier: Supplier) => {
    onSelectSupplier(supplier.cnpj);
    setIsModalVisible(false);
  };

  return (
    <View>
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="bg-white border border-gray-300 rounded-md p-3"
      >
        <Text className={selectedSupplier ? "text-gray-900" : "text-gray-500"}>
          {selectedSupplier ? `${selectedSupplier.nome} (${selectedSupplier.cnpj})` : "Selecione um fornecedor"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-gray-50">
          <View className="bg-white p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold">Selecionar Fornecedor</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text className="text-blue-600 text-lg">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <Text>Carregando fornecedores...</Text>
            </View>
          ) : (
            <FlatList
              data={suppliers}
              keyExtractor={(item) => item.cnpj}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectSupplier(item)}
                  className="bg-white p-4 border-b border-gray-100"
                >
                  <Text className="font-semibold text-lg">{item.nome}</Text>
                  <Text className="text-gray-600">CNPJ: {item.cnpj}</Text>
                  {item.telefone_contato && <Text className="text-gray-600">Tel: {item.telefone_contato}</Text>}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center p-8">
                  <Text className="text-gray-500 text-center">
                    Nenhum fornecedor cadastrado.{'\n'}
                    Cadastre um fornecedor primeiro.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
} 