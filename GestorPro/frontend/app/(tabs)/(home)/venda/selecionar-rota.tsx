import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useSale } from '../../../../context/SaleContext';
import { getRoutes } from '../../../../services/api';
import { Route } from '../../../../types';

export default function SelecionarRotaScreen() {
  const { setRouteForSale } = useSale();
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);

  useFocusEffect(useCallback(() => {
    getRoutes().then(setRoutes).catch(console.error);
  }, []));

  const handleSelect = (route: Route) => {
    setRouteForSale(route);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id_rota?.toString() || '0'}
        className="p-4"
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleSelect(item)}
            className="bg-white p-4 rounded-lg shadow-sm mb-3 active:bg-gray-100"
          >
            <Text className="font-bold text-lg">{item.nome_rota}</Text>
            <Text className="text-gray-600">{item.descricao_rota}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}