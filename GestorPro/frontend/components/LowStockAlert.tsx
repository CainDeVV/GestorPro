import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../types';

interface LowStockAlertProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export default function LowStockAlert({ products, onProductPress }: LowStockAlertProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons name="alert-circle" size={24} color="#dc2626" />
        <Text className="text-red-800 font-bold ml-2">
          Alerta de Estoque Baixo ({products.length})
        </Text>
      </View>
      
      <FlatList
        data={products.slice(0, 5)} // Mostra apenas os 5 primeiros
        keyExtractor={(item) => item.codigo_barras}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onProductPress?.(item)}
            className="flex-row items-center justify-between py-2 border-b border-red-100"
          >
            <View className="flex-1">
              <Text className="text-red-700 font-medium">{item.nome}</Text>
              <Text className="text-red-600 text-sm">
                Estoque: {item.quantidade} unidades
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#dc2626" />
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
      
      {products.length > 5 && (
        <Text className="text-red-600 text-sm mt-2 text-center">
          +{products.length - 5} produtos com estoque baixo
        </Text>
      )}
    </View>
  );
}
