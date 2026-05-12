import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView, ScrollView, View } from 'react-native';
import MenuButton from '../../../components/MenuButton'; // Ajuste o caminho se necessário

export default function HomeScreen() {
  const iconSize = 48;
  const iconColor = "#374151"; // Cor cinza escuro

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="items-center">
        <View className="flex-row flex-wrap justify-center p-4 mt-4">

          <Link href="/(tabs)/(home)/cadastrar" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="clipboard-text-outline" size={iconSize} color={iconColor} />}
              label="Cadastrar"
            />
          </Link>
          
          <Link href="/(tabs)/(home)/estoque" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="package-variant-closed" size={iconSize} color={iconColor} />}
              label="Estoque"
            />
          </Link>
          
          <Link href="/(tabs)/(home)/vendedor" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="account-group-outline" size={iconSize} color={iconColor} />}
              label="Vendedores"
            />
          </Link>

          <Link href="/(tabs)/(home)/venda" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="store-outline" size={iconSize} color={iconColor} />}
              label="Abrir Venda"
            />
          </Link>
          
          <Link href="/(tabs)/(home)/fechar-venda" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="store-remove-outline" size={iconSize} color={iconColor} />}
              label="Fechar Venda"
            />
          </Link>

          <Link href="/(tabs)/(home)/rota" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="map-marker-path" size={iconSize} color={iconColor} />}
              label="Rotas"
            />
          </Link>

          <Link href="/(tabs)/(home)/fornecedor" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="truck-delivery-outline" size={iconSize} color={iconColor} />}
              label="Fornecedores"
            />
          </Link>

          <Link href="/(tabs)/(home)/cliente" asChild>
            <MenuButton
              icon={<MaterialCommunityIcons name="account-outline" size={iconSize} color={iconColor} />}
              label="Clientes"
            />
          </Link>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}