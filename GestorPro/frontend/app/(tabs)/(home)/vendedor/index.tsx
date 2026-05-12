import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import VendorListItem from '../../../../components/VendorListItem';
import { useListScreenLogic } from '../../../../hooks/useListScreenLogic';
import { deleteVendors, getVendors } from '../../../../services/api';
import { Vendor } from '../../../../types';

export default function VendedorScreen() {
  const router = useRouter();
  const {
    items: vendors,
    isLoading,
    selectedIds,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleSelectItem,
    handleConfirmDelete,
  } = useListScreenLogic<Vendor>({
    fetchFn: getVendors,
    deleteFn: deleteVendors,
    entityName: 'Vendedores',
    editRoute: '/vendedor/editar',
    // AQUI ESTÁ A MUDANÇA: Informamos ao hook que a chave primária é 'cpf'
    primaryKeyField: 'cpf',
  });

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando vendedores...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <FlatList
          data={vendors}
          // Usamos a chave primária correta aqui
          keyExtractor={(item) => item.cpf}
          renderItem={({ item }) => (
            <VendorListItem
              vendor={item}
              // E também aqui
              onPress={() => router.push(`/vendedor/${item.cpf}`)}
              onSelect={() => handleSelectItem(item.cpf)}
              isSelected={selectedIds.includes(item.cpf)}
            />
          )}
          ListEmptyComponent={<View className="items-center mt-20"><Text className="text-gray-500">Nenhum vendedor cadastrado.</Text></View>}
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