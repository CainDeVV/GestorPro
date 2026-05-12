import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export default function MenuButton({ icon, label, onPress }: MenuButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white border border-gray-200 rounded-lg w-36 h-36 m-2 justify-center items-center shadow-sm active:opacity-70"
    >
      {/* Ícone */}
      <View className="mb-2">
        {icon}
      </View>
      {/* Texto */}
      <Text className="text-gray-700 font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}