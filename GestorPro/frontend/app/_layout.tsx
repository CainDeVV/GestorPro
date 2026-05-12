import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SaleProvider } from '../context/SaleContext';
// A importação do 'initDB' foi removida daqui
import "./global.css";

// Componente da Splash Screen (não precisa de alterações)
function SplashScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <FontAwesome name="thumbs-o-up" size={120} color="#34D399" />
      <Text className="text-5xl font-bold text-gray-800 mt-8 mb-8">
        GestorPro
      </Text>
      <View className="w-1/3 h-1 bg-gray-200 rounded-full overflow-hidden">
        <View className="w-1/3 h-1 bg-green-400" />
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // A chamada para 'initDB()' foi removida daqui
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SaleProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SaleProvider>
  );
}