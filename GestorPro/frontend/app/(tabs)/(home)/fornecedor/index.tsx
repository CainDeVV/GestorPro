import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import SupplierListItem from '../../../../components/SupplierListItem';
import { useListScreenLogic } from '../../../../hooks/useListScreenLogic';
import { deleteSuppliers, getSuppliers } from '../../../../services/api';
import { Supplier } from '../../../../types';

export default function FornecedorScreen() {
  const router = useRouter();
  const {
    items: suppliers,
    isLoading,
    selectedIds,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleSelectItem,
    handleConfirmDelete,
  } = useListScreenLogic<Supplier>({
    fetchFn: getSuppliers,
    deleteFn: deleteSuppliers,
    entityName: 'Fornecedores',
    editRoute: '/fornecedor/editar',
    primaryKeyField: 'cnpj',
  });

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando fornecedores...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <FlatList
          data={suppliers}
          keyExtractor={(item) => item.cnpj}
          renderItem={({ item }) => (
            <SupplierListItem
              supplier={item}
              onPress={() => router.push(`/fornecedor/${item.cnpj}`)}
              onSelect={() => handleSelectItem(item.cnpj)}
              isSelected={selectedIds.includes(item.cnpj)}
            />
          )}
          ListEmptyComponent={<View className="items-center mt-20"><Text className="text-gray-500">Nenhum fornecedor cadastrado.</Text></View>}
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
