import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Supplier } from '../types';

interface SupplierListItemProps {
  supplier: Supplier;
  onPress: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function SupplierListItem({ supplier, onPress, onSelect, isSelected }: SupplierListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onSelect}
      className={`p-4 bg-white rounded-lg mb-2 border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200'}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {supplier.nome || 'Nome não informado'}
          </Text>
          <Text className="text-sm text-gray-600">CNPJ: {supplier.cnpj}</Text>
          {supplier.telefone_contato && (
            <Text className="text-sm text-gray-600">Tel: {supplier.telefone_contato}</Text>
          )}
          {supplier.email && (
            <Text className="text-sm text-gray-600">Email: {supplier.email}</Text>
          )}
          {supplier.endereco && (
            <Text className="text-sm text-gray-600" numberOfLines={2}>
              Endereço: {supplier.endereco}
            </Text>
          )}
        </View>
        {isSelected && (
          <FontAwesome name="check-circle" size={24} color="#3b82f6" />
        )}
      </View>
    </TouchableOpacity>
  );
}
