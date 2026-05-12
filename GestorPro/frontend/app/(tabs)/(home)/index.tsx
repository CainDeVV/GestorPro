import { Redirect } from 'expo-router';

export default function HomeIndex() {
  // Redireciona diretamente para a tela home com os cards principais
  return <Redirect href="/(tabs)/(home)/home" />;
}
