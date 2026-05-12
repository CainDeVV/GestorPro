import { Stack } from 'expo-router';
import React from 'react';

export default function FecharVendaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Fechar Venda' }} />
    </Stack>
  );
}