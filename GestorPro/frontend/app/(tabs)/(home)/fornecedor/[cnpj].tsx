import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { showSupplierDeletionErrorAlert } from '../../../../components/ErrorAlert';
import { Supplier } from '../../../../types';
import { deleteSupplier as deleteSuppliers, getSupplierByCnpj } from '../../../../services/api';

// Componente para campos de detalhe
function DetailField({ label, value }: { label: string, value: string | number | null | undefined }) {
  return (
    <View className="border-b border-gray-200 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-lg text-gray-800">{value || 'Não informado'}</Text>
    </View>
  );
}

export default function FornecedorDetailScreen() {
  const { cnpj } = useLocalSearchParams<{ cnpj: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(useCallback(() => {
    const loadSupplier = async () => {
      if (cnpj) {
        try {
          const data = await getSupplierByCnpj(cnpj);
          setSupplier(data);
        } catch (e) { Alert.alert("Erro", "Fornecedor não encontrado."); }
      }
    };
    loadSupplier();
  }, [cnpj]));

  const handleConfirmDelete = async () => {
    if (!cnpj) return;
    try {
      await deleteSuppliers([cnpj]);
      setDeleteModalVisible(false);
      Alert.alert("Sucesso", `O fornecedor "${supplier?.nome || 'Fornecedor'}" foi excluído.`);
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      // Verifica se é um erro de exclusão com dependências
      if (error.message && error.message.includes("Não é possível excluir")) {
        showSupplierDeletionErrorAlert(error.message);
      } else {
        Alert.alert("Erro", error.message);
      }
    }
  };

  useLayoutEffect(() => {
    if (supplier) {
      navigation.setOptions({
        title: supplier.nome || 'Fornecedor',
        headerRight: () => (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push(`/fornecedor/editar?cnpj=${cnpj}`)} className="mr-4">
              <FontAwesome name="pencil" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <FontAwesome name="trash" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )
      });
    }
  }, [navigation, supplier, router, cnpj]);

  if (!supplier) return <View className="flex-1 justify-center items-center"><Text>Carregando fornecedor...</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <DetailField label="Nome" value={supplier.nome} />
        <DetailField label="CNPJ" value={supplier.cnpj} />
        <DetailField label="Telefone" value={supplier.telefone_contato} />
        <DetailField label="Email" value={supplier.email} />
        <DetailField label="Endereço" value={supplier.endereco} />
      </ScrollView>
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
