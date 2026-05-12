import { Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FornecedorLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Fornecedores',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/(home)/cadastrar/novo-fornecedor')}
              className="mr-4"
            >
              <FontAwesome name="plus" size={24} color="#3b82f6" />
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen name="[cnpj]" options={{ title: 'Detalhes do Fornecedor' }} />
      <Stack.Screen name="editar" options={{ title: 'Editar Fornecedor' }} />
    </Stack>
  );
}
