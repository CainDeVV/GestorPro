import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { showDeletionErrorAlert, showVendorDeletionErrorAlert } from '../components/ErrorAlert';

// A interface para os parâmetros do hook
interface UseListScreenLogicParams<T> {
  fetchFn: () => Promise<T[]>;
  // AQUI ESTÁ A MUDANÇA PRINCIPAL:
  // A função de deletar agora pode receber um array de strings OU números.
  deleteFn: (ids: (string | number)[]) => Promise<any>;
  entityName: string;
  editRoute: string;
  // O hook agora precisa saber qual campo usar como chave primária.
  primaryKeyField: keyof T;
}

export function useListScreenLogic<T>({
  fetchFn,
  deleteFn,
  entityName,
  editRoute,
  primaryKeyField,
}: UseListScreenLogicParams<T>) {
  const navigation = useNavigation();
  const router = useRouter();

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // A lista de IDs selecionados também pode guardar strings ou números.
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchFn();
      setItems(data);
    } catch (error) {
      console.error(`Erro ao carregar ${entityName}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, entityName]);

  useFocusEffect(useCallback(() => { loadItems(); }, [loadItems]));

  const handleSelectItem = useCallback((id: string | number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteFn(selectedIds);
      setDeleteModalVisible(false);
      setSelectedIds([]);
      Alert.alert("Sucesso", `${entityName}(s) excluído(s).`);
      loadItems();
    } catch (error: any) {
      // Verifica se é um erro de exclusão com dependências (código 400)
      if (error.message && error.message.includes("Não é possível excluir")) {
        // Verifica se é um erro específico de vendedor
        if (error.message.includes("vendedor")) {
          showVendorDeletionErrorAlert(error.message);
        } else {
          showDeletionErrorAlert(error.message);
        }
      } else {
        Alert.alert("Erro", error.message || `Não foi possível excluir.`);
      }
    }
  }, [deleteFn, selectedIds, entityName, loadItems]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedIds.length === 0 ? entityName : `${selectedIds.length} selecionado(s)`,
      headerRight: () => {
        if (selectedIds.length > 0) {
          return (
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => { if (selectedIds.length === 1) router.push(`${editRoute}?id=${selectedIds[0]}`); }}
                className="mr-5"
                disabled={selectedIds.length !== 1}
              >
                <FontAwesome name="pencil" size={24} color={selectedIds.length === 1 ? '#3b82f6' : '#9ca3af'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
                <FontAwesome name="trash" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          );
        }
        return null;
      },
    });
  }, [navigation, selectedIds, router, entityName, editRoute, setDeleteModalVisible]);

  return {
    items,
    isLoading,
    selectedIds,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleSelectItem,
    handleConfirmDelete,
  };
}