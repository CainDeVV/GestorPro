import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Este componente recebe o título como uma propriedade (props)
export default function CustomHeader({ 
  title, 
  showBackButton = false 
}: { 
  title: string;
  showBackButton?: boolean;
}) {
  // Hook para pegar a altura da área segura (para não ficar embaixo do notch do iPhone)
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ paddingTop: top }} className="bg-white">
      <View className="h-16 flex-row justify-between items-center border-b border-gray-200 px-4">
        {showBackButton && (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2"
          >
            <FontAwesome name="arrow-left" size={20} color="#374151" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-gray-800 flex-1 text-center">
          {title}
        </Text>
        {showBackButton && <View className="w-10" />} {/* Espaçador para centralizar o título */}
      </View>
    </View>
  );
}