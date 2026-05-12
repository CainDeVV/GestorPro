import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // AQUI ESTÁ A CORREÇÃO PRINCIPAL:
        // Desliga o cabeçalho para TODAS as telas dentro destas abas.
        headerShown: false,

        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: 'white',
          height: 60,
          paddingBottom: 5,
        },
      }}>
      <Tabs.Screen
        name="(home)" // Aponta para o nosso grupo/pilha da home
        options={{
          title: 'Home', // 'title' aqui afeta apenas o texto da aba, não mais o cabeçalho
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          href: '/(tabs)/(home)', // Garante que sempre volta para a tela home
        }}
      />
      <Tabs.Screen
        name="(stats)" // Aponta para o nosso grupo/pilha da stats
        options={{
          title: 'Estatísticas', // Afeta apenas o texto da aba
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bar-chart" color={color} />,
        }}
      />
    </Tabs>
  );
}