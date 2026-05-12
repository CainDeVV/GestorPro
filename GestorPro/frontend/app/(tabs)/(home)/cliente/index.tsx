import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import ClienteListItem from '../../../../components/ClienteListItem';
import { useListScreenLogic } from '../../../../hooks/useListScreenLogic';
import { deleteClientes, getClientes } from '../../../../services/api';
import { Cliente } from '../../../../types';

export default function ClienteScreen() {
  const router = useRouter();
  const {
    items: clientes,
    isLoading,
    selectedIds,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleSelectItem,
    handleConfirmDelete,
  } = useListScreenLogic<Cliente>({
    fetchFn: getClientes,
    deleteFn: deleteClientes,
    entityName: 'Clientes',
    editRoute: '/cliente/editar',
    primaryKeyField: 'id_cliente',
  });

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando clientes...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id_cliente?.toString() || '0'}
          renderItem={({ item }) => (
            <ClienteListItem
              cliente={item}
              onPress={() => router.push(`/cliente/${item.id_cliente || 0}`)}
              onSelect={() => handleSelectItem(item.id_cliente || 0)}
              isSelected={selectedIds.includes(item.id_cliente || 0)}
            />
          )}
          ListEmptyComponent={<View className="items-center mt-20"><Text className="text-gray-500">Nenhum cliente cadastrado.</Text></View>}
        />
      </View>
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
