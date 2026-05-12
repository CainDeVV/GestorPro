import { Stack } from 'expo-router';
import React from 'react';

export default function CadastroLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Cadastrar' }} />
      <Stack.Screen name="novo-produto" options={{ title: 'Novo Produto' }} />
      <Stack.Screen name="novo-vendedor" options={{ title: 'Novo Vendedor' }} />
      <Stack.Screen name="nova-rota" options={{ title: 'Nova Rota' }} />
      <Stack.Screen name="novo-fornecedor" options={{ title: 'Novo Fornecedor' }} />
      <Stack.Screen name="novo-cliente" options={{ title: 'Novo Cliente' }} />
    </Stack>
  );
}