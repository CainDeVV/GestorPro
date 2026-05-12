import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Route } from '../app/(tabs)/(home)/rota';

interface RouteListItemProps {
  route: Route;
  onPress: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function RouteListItem({ route, onPress, onSelect, isSelected }: RouteListItemProps) {
  const itemStyle = isSelected ? 'border-l-4 border-green-500' : '';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white p-4 rounded-lg shadow-sm mb-4 flex-row items-center active:bg-gray-100 ${itemStyle}`}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{route.nome_rota}</Text>
        <Text className="text-base text-gray-600" numberOfLines={1}>{route.descricao_rota}</Text>
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