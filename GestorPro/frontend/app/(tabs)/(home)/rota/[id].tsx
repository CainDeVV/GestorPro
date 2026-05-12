import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { showDeletionErrorAlert } from '../../../../components/ErrorAlert';
import { deleteRoutes, getRouteById } from '../../../../services/api';
import { Route } from '../../../../types';

// Componente para campos de detalhe
function DetailField({ label, value }: { label: string, value: string | number }) {
  return (
    <View className="border-b border-gray-200 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-lg text-gray-800">{value}</Text>
    </View>
  );
}

export default function RotaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [route, setRoute] = useState<Route | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(useCallback(() => {
    const loadRoute = async () => {
      // MUDANÇA: Convertemos o ID da URL (que é texto) para número
      const routeId = parseInt(id || '0', 10);
      if (routeId > 0) {
        try {
          const data = await getRouteById(routeId);
          setRoute(data);
        } catch(e) { Alert.alert("Erro", "Não foi possível carregar a rota."); }
      }
    };
    loadRoute();
  }, [id]));

  const handleConfirmDelete = async () => {
    const routeId = parseInt(id || '0', 10);
    if (!routeId) return;
    try {
      await deleteRoutes([routeId]);
      setDeleteModalVisible(false);
      Alert.alert("Sucesso", `A rota "${route?.nome_rota}" foi excluída.`);
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      // Verifica se é um erro de exclusão com dependências
      if (error.message && error.message.includes("Não é possível excluir")) {
        showDeletionErrorAlert(error.message);
      } else {
        Alert.alert("Erro", error.message);
      }
    }
  };

  useLayoutEffect(() => {
    if (route) {
      navigation.setOptions({
        // MUDANÇA: Usamos 'nome_rota' para o título
        title: route.nome_rota,
        headerRight: () => (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push(`/rota/editar?id=${id}`)} className="mr-4">
              <FontAwesome name="pencil" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <FontAwesome name="trash" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )
      });
    }
  }, [navigation, route, router, id]);

  if (!route) return <View className="flex-1 justify-center items-center"><Text>Carregando rota...</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* MUDANÇA: Usamos os nomes de campo corretos do backend */}
        <DetailField label="Nome da Rota" value={route.nome_rota} />
        <DetailField label="Descrição" value={route.descricao_rota || 'N/A'} />
      </ScrollView>
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}