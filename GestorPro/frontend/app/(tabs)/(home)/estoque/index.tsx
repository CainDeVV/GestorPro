import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import ProductListItem from '../../../../components/ProductListItem';
import { useListScreenLogic } from '../../../../hooks/useListScreenLogic';
import { Product } from '../../../../types';
import { deleteProducts, getProducts } from '../../../../services/api';

export default function EstoqueScreen() {
  const router = useRouter();
  const {
    items: products,
    isLoading,
    selectedIds,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleSelectItem,
    handleConfirmDelete,
  } = useListScreenLogic<Product>({
    fetchFn: getProducts,
    deleteFn: deleteProducts,
    entityName: 'Estoque',
    editRoute: '/estoque/editar',
    // AQUI ESTÁ A MUDANÇA: Informamos ao hook que a chave primária é 'codigo_barras'
    primaryKeyField: 'codigo_barras',
  });

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando estoque...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <FlatList
          data={products}
          // Usamos a chave primária correta aqui
          keyExtractor={(item) => item.codigo_barras}
          renderItem={({ item }) => (
            <ProductListItem
              product={item}
              // E também aqui
              onPress={() => router.push(`/estoque/${item.codigo_barras}`)}
              onSelect={() => handleSelectItem(item.codigo_barras)}
              isSelected={selectedIds.includes(item.codigo_barras)}
            />
          )}
          ListEmptyComponent={<View className="items-center mt-20"><Text className="text-gray-500">Nenhum produto cadastrado.</Text></View>}
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