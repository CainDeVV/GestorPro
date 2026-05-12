import { Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EstoqueLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Estoque',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/(home)/cadastrar/novo-produto')}
              className="mr-4"
            >
              <FontAwesome name="plus" size={24} color="#3b82f6" />
            </TouchableOpacity>
          )
        }} 
      />
      {/* O título das outras telas será definido dinamicamente */}
      <Stack.Screen name="[id]" /> 
      <Stack.Screen name="editar" options={{ title: 'Editando Produto' }} />
    </Stack>
  );
}