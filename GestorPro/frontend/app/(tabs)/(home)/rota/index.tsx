import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import RouteListItem from '../../../../components/RouteListItem';
import { useListScreenLogic } from '../../../../hooks/useListScreenLogic';
import { deleteRoutes, getRoutes } from '../../../../services/api';
import { Route } from '../../../../types';

export default function RotaScreen() {
  const router = useRouter();
  const {
    items: routes,
    isLoading,
    selectedIds,
    isDeleteModalVisible,
    setDeleteModalVisible,
    handleSelectItem,
    handleConfirmDelete,
  } = useListScreenLogic<Route>({ // O tipo <Route> continua o mesmo
    fetchFn: getRoutes,
    deleteFn: deleteRoutes,
    entityName: 'Rotas',
    editRoute: '/rota/editar',
    // AQUI ESTÁ A MUDANÇA: Dizemos ao hook que a chave primária da Rota é 'id_rota'
    primaryKeyField: 'id_rota', 
  });

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando rotas...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <FlatList
          data={routes}
          // Usamos a chave primária correta aqui
          keyExtractor={(item) => item.id_rota?.toString() || ''}
          renderItem={({ item }) => (
            <RouteListItem
              route={item}
              // E também aqui
              onPress={() => router.push(`/rota/${item.id_rota}`)}
              onSelect={() => handleSelectItem(item.id_rota || 0)} // Não precisa mais de toString()
              isSelected={selectedIds.includes(item.id_rota || 0)}
            />
          )}
          ListEmptyComponent={<View className="items-center mt-20"><Text>Nenhuma rota cadastrada.</Text></View>}
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