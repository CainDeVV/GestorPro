import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Cliente } from '../types';

interface ClienteListItemProps {
  cliente: Cliente;
  onPress: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function ClienteListItem({ cliente, onPress, onSelect, isSelected }: ClienteListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onSelect}
      className={`p-4 bg-white rounded-lg mb-2 border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200'}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {cliente.nome}
          </Text>
          {cliente.cpf_cnpj && (
            <Text className="text-sm text-gray-600">CPF/CNPJ: {cliente.cpf_cnpj}</Text>
          )}
          {cliente.telefone && (
            <Text className="text-sm text-gray-600">Tel: {cliente.telefone}</Text>
          )}
          {cliente.endereco && (
            <Text className="text-sm text-gray-600" numberOfLines={2}>
              Endereço: {cliente.endereco}
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
