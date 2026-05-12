import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { showClienteDeletionErrorAlert } from '../../../../components/ErrorAlert';
import { Cliente } from '../../../../types';
import { deleteClientes, getClienteById } from '../../../../services/api';

// Componente para campos de detalhe
function DetailField({ label, value }: { label: string, value: string | number | null | undefined }) {
  return (
    <View className="border-b border-gray-200 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-lg text-gray-800">{value || 'Não informado'}</Text>
    </View>
  );
}

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(useCallback(() => {
    const loadCliente = async () => {
      if (id) {
        try {
          const data = await getClienteById(Number(id));
          setCliente(data);
        } catch (e) { Alert.alert("Erro", "Cliente não encontrado."); }
      }
    };
    loadCliente();
  }, [id]));

  const handleConfirmDelete = async () => {
    if (!id) return;
    try {
      await deleteClientes([Number(id)]);
      setDeleteModalVisible(false);
      Alert.alert("Sucesso", `O cliente "${cliente?.nome}" foi excluído.`);
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      // Verifica se é um erro de exclusão com dependências
      if (error.message && error.message.includes("Não é possível excluir")) {
        showClienteDeletionErrorAlert(error.message);
      } else {
        Alert.alert("Erro", error.message);
      }
    }
  };

  useLayoutEffect(() => {
    if (cliente) {
      navigation.setOptions({
        title: cliente.nome,
        headerRight: () => (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push(`/cliente/editar?id=${id}`)} className="mr-4">
              <FontAwesome name="pencil" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <FontAwesome name="trash" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )
      });
    }
  }, [navigation, cliente, router, id]);

  if (!cliente) return <View className="flex-1 justify-center items-center"><Text>Carregando cliente...</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <DetailField label="Nome" value={cliente.nome} />
        <DetailField label="CPF/CNPJ" value={cliente.cpf_cnpj} />
        <DetailField label="Telefone" value={cliente.telefone} />
        <DetailField label="Endereço" value={cliente.endereco} />
      </ScrollView>
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
