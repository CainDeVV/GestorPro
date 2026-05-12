import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { showVendorDeletionErrorAlert } from '../../../../components/ErrorAlert';
import { Vendor } from '../../../../types';
import { deleteVendors, getVendorByCpf } from '../../../../services/api';

// Componente para campos de detalhe
function DetailField({ label, value }: { label: string, value: string | number }) {
  return (
    <View className="border-b border-gray-200 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-lg text-gray-800">{value}</Text>
    </View>
  );
}

export default function VendedorDetailScreen() {
  // 'id' aqui na verdade conterá o CPF vindo da URL
  const { id: cpf } = useLocalSearchParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(useCallback(() => {
    const loadVendor = async () => {
      if (cpf) {
        try {
          const data = await getVendorByCpf(cpf);
          setVendor(data);
        } catch (e) { Alert.alert("Erro", "Vendedor não encontrado."); }
      }
    };
    loadVendor();
  }, [cpf]));

  const handleConfirmDelete = async () => {
    if (!cpf) return;
    try {
      await deleteVendors([cpf]);
      setDeleteModalVisible(false);
      Alert.alert("Sucesso", `O vendedor "${vendor?.nome}" foi excluído.`);
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      // Verifica se é um erro de exclusão com dependências
      if (error.message && error.message.includes("Não é possível excluir")) {
        showVendorDeletionErrorAlert(error.message);
      } else {
        Alert.alert("Erro", error.message);
      }
    }
  };

  useLayoutEffect(() => {
    if (vendor) {
      navigation.setOptions({
        title: vendor.nome,
        headerRight: () => (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push(`/vendedor/editar?id=${cpf}`)} className="mr-4">
              <FontAwesome name="pencil" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <FontAwesome name="trash" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )
      });
    }
  }, [navigation, vendor, router, cpf]);

  if (!vendor) return <View className="flex-1 justify-center items-center"><Text>Carregando vendedor...</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <DetailField label="Nome" value={vendor.nome} />
        <DetailField label="Apelido" value={vendor.apelido} />
        <DetailField label="CPF" value={vendor.cpf} />
        <DetailField label="Telefone" value={vendor.telefone} />
      </ScrollView>
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}