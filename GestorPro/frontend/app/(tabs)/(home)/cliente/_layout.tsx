import { Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ClienteLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Clientes',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/(home)/cadastrar/novo-cliente')}
              className="mr-4"
            >
              <FontAwesome name="plus" size={24} color="#3b82f6" />
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen name="[id]" options={{ title: 'Detalhes do Cliente' }} />
      <Stack.Screen name="editar" options={{ title: 'Editar Cliente' }} />
    </Stack>
  );
}
