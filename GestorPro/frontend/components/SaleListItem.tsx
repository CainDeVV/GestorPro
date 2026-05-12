import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Sale } from '../types';

interface SaleListItemProps {
  sale: Sale;
  onSelect: () => void;
  isSelected: boolean;
}

export default function SaleListItem({ sale, onSelect, isSelected }: SaleListItemProps) {
  const itemStyle = isSelected ? 'border-l-4 border-green-500' : '';
  
  return (
    <View className={`bg-white p-4 rounded-lg shadow-sm mb-4 flex-row items-center ${itemStyle}`}>
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{sale.nome}</Text>
        <Text className="text-base text-gray-600">
          Total: R$ {(sale.total || 0).toFixed(2).replace('.', ',')}
        </Text>
      </View>
      <TouchableOpacity onPress={onSelect} className="p-2">
        {isSelected ? (
          <FontAwesome name="check-square" size={24} color="#16a34a" />
        ) : (
          <FontAwesome name="square-o" size={24} color="#9ca3af" />
        )}
      </TouchableOpacity>
    </View>
  );
}