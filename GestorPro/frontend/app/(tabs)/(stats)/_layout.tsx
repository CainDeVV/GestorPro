import { Stack } from 'expo-router';
import React from 'react';

export default function StatsStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Estatísticas',
        }}
      />
    </Stack>
  );
}