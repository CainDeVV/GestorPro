import { Stack } from 'expo-router';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader'; // Verifique se o caminho está certo

export default function HomeStackLayout() {
  return (
    <Stack
      // REGRA DE OURO: Definimos o cabeçalho padrão para TODA a pilha aqui.
      // Isso garante que ele sempre apareça, a menos que uma tela diga o contrário.
      screenOptions={{
        header: () => <CustomHeader title="GestorPro" />,
      }}
    >
      {/* A tela 'index' (Home) usará o cabeçalho padrão definido acima. 
        Ela não precisa mais de 'options' próprias para o cabeçalho. 
      */}
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />

      {/* Todas as outras seções são exceções à regra.
        Elas escondem o cabeçalho "GestorPro" para que suas próprias
        pilhas internas possam mostrar seus próprios cabeçalhos.
      */}
      <Stack.Screen name="cadastrar" options={{ headerShown: false }} />
      <Stack.Screen name="estoque" options={{ headerShown: false }} />
      <Stack.Screen name="vendedor" options={{ headerShown: false }} />
      <Stack.Screen name="rota" options={{ headerShown: false }} />
      <Stack.Screen name="venda" options={{ headerShown: false }}/>
      <Stack.Screen name="fechar-venda" options={{ headerShown: false }}/>
    </Stack>
  );
}