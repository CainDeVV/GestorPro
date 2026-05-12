import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../types'; // Importa do novo local
import { safeCurrency, safeValue } from '../utils/safeValues';

interface ProductListItemProps {
  product: Product;
  onPress: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function ProductListItem({ product, onPress, onSelect, isSelected }: ProductListItemProps) {
  const itemStyle = isSelected ? 'border-l-4 border-green-500' : '';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white p-4 rounded-lg shadow-sm mb-4 flex-row items-center active:bg-gray-100 ${itemStyle}`}
    >
      <View className="flex-1">
        <Text className="text-sm text-gray-400">Código: {safeValue(product.codigo_barras, 'N/A')}</Text>
        <Text className="text-lg font-bold text-gray-800">{safeValue(product.nome, 'Sem nome')}</Text>
        <Text className="text-base text-green-600 font-semibold">
          {safeCurrency(product.preco_venda, 0)}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">Estoque: {safeValue(product.quantidade, 0)} Un</Text>
        {product.categoria && (
          <Text className="text-xs text-gray-500 mt-1">Categoria: {product.categoria}</Text>
        )}
      </View>
      <TouchableOpacity onPress={onSelect} className="p-2">
        {isSelected ? (
          <FontAwesome name="check-square" size={24} color="#16a34a" />
        ) : (
          <FontAwesome name="square-o" size={24} color="#9ca3af" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}