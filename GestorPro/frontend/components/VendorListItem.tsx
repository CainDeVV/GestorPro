import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Vendor } from '../types'; // Importa do local correto

interface VendorListItemProps {
  vendor: Vendor;
  onPress: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function VendorListItem({ vendor, onPress, onSelect, isSelected }: VendorListItemProps) {
  const itemStyle = isSelected ? 'border-l-4 border-green-500' : '';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white p-4 rounded-lg shadow-sm mb-4 flex-row items-center active:bg-gray-100 ${itemStyle}`}
    >
      <View className="flex-1">
        <Text className="text-sm text-gray-400">ID: {vendor.codigo}</Text>
        <Text className="text-lg font-bold text-gray-800">{vendor.nome}</Text>
        <Text className="text-base text-gray-600">CPF: {vendor.cpf}</Text>
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