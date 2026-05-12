import { Redirect } from 'expo-router';

export default function StartPage() {
  // Redireciona para a tela home dentro da estrutura de abas
  return <Redirect href="/(tabs)/(home)/home" />;
}