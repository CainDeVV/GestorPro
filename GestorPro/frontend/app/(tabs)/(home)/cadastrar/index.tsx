import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import MenuButton from '../../../../components/MenuButton'; // Reutilizando nosso componente

export default function CadastrarScreen() {
  const iconSize = 48;
  const iconColor = "#374151";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row flex-wrap justify-center p-4 mt-4">
        <Link href="/cadastrar/novo-produto" asChild>
          <MenuButton
            icon={<MaterialCommunityIcons name="package-variant-closed" size={iconSize} color={iconColor} />}
            label="Produto"
          />
        </Link>
        <Link href="/cadastrar/novo-vendedor" asChild>
          <MenuButton
            icon={<MaterialCommunityIcons name="account-tie-outline" size={iconSize} color={iconColor} />}
            label="Vendedor"
          />
        </Link>
        <Link href="/cadastrar/novo-cliente" asChild>
          <MenuButton
            icon={<MaterialCommunityIcons name="account-outline" size={iconSize} color={iconColor} />}
            label="Cliente"
          />
        </Link>

        <Link href="/cadastrar/novo-fornecedor" asChild>
          <MenuButton
            icon={<MaterialCommunityIcons name="factory" size={iconSize} color={iconColor} />}
            label="Fornecedor"
          />
        </Link>
        <Link href="/cadastrar/nova-rota" asChild>
          <MenuButton
            icon={<MaterialCommunityIcons name="map-marker-path" size={iconSize} color={iconColor} />}
            label="Rota"
          />
        </Link>
      </View>
    </SafeAreaView>
  );
}