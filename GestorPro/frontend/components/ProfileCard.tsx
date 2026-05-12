import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Definimos as propriedades que este componente espera receber
interface ProfileCardProps {
  name: string;
  onPress: () => void;
}

export default function ProfileCard({ name, onPress }: ProfileCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white p-4 rounded-lg shadow-sm mb-6 active:bg-gray-100"
    >
      <View className="w-12 h-12 bg-gray-200 rounded-full justify-center items-center mr-4">
        <FontAwesome name="user" size={24} color="#6b7280" />
      </View>
      <Text className="text-xl font-bold text-gray-800">{name}</Text>
      {/* Ícone de lápis para indicar que é editável */}
      <View className="ml-auto">
        <FontAwesome name="pencil" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}