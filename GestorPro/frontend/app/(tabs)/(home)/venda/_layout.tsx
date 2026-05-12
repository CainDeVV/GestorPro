import { Stack } from 'expo-router';
import React from 'react';

export default function VendaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Vendas Registradas' }} />
      <Stack.Screen name="nova-venda" options={{ title: 'Nova Venda' }} />
      <Stack.Screen name="selecionar-produto" options={{ title: 'Selecionar Produtos' }} />
      <Stack.Screen name="selecionar-vendedor" options={{ title: 'Selecionar Vendedor' }} />
      <Stack.Screen name="selecionar-rota" options={{ title: 'Selecionar Rota' }} />
      <Stack.Screen name="selecionar-cliente" options={{ title: 'Selecionar Cliente' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalhes da Venda' }} />
    </Stack>
  );
}