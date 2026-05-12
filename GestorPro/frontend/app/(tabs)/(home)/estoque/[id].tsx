import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { Product } from '../../../../types';
import { deleteProducts, getProductById } from '../../../../services/api';

// Componente para campos de detalhe (este já estava correto)
function DetailField({ label, value }: { label: string, value: string | number }) {
  return (
    <View className="border-b border-gray-200 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-lg text-gray-800">{value}</Text>
    </View>
  );
}

export default function ProductDetailScreen() {
  // 'id' aqui conterá o código de barras
  const { id: codigo_barras } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  // Função para tratar valores null/undefined de forma segura
  const safeValue = (value: any, defaultValue: any = 0) => {
    return value === null || value === undefined ? defaultValue : value;
  };

  useFocusEffect(useCallback(() => {
    const loadProduct = async () => {
      if (codigo_barras) {
        try {
          const data = await getProductById(codigo_barras);
          setProduct(data);
        } catch (error) { Alert.alert("Erro", "Produto não encontrado."); }
      }
    };
    loadProduct();
  }, [codigo_barras]));

  const handleConfirmDelete = async () => {
    if (!codigo_barras) return;
    try {
      await deleteProducts([codigo_barras]);
      setDeleteModalVisible(false);
      Alert.alert("Sucesso", `O produto "${product?.nome}" foi excluído.`);
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  useLayoutEffect(() => {
    if (product) {
      navigation.setOptions({
        title: safeValue(product.nome, 'Produto'),
        headerRight: () => (
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push(`/estoque/editar?id=${codigo_barras}`)} className="mr-4">
              <FontAwesome name="pencil" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <FontAwesome name="trash" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )
      });
    }
  }, [navigation, product, router, codigo_barras]);

  if (!product) return <View className="flex-1 justify-center items-center"><Text>Carregando produto...</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <DetailField label="Código de Barras" value={safeValue(product.codigo_barras, 'N/A')} />
        <DetailField label="Nome do produto" value={safeValue(product.nome, 'Sem nome')} />
        <DetailField label="Categoria" value={safeValue(product.categoria, 'N/A')} />
        <DetailField label="Preço de Venda" value={`R$ ${safeValue(product.preco_venda, 0).toFixed(2)}`} />
        <DetailField label="Preço de Custo" value={`R$ ${safeValue(product.preco_custo, 0).toFixed(2)}`} />
        <DetailField label="Quantidade" value={`${safeValue(product.quantidade, 0)} Unidades`} />
        <DetailField label="Peso" value={`${safeValue(product.peso, 0)} Kg`} />
        <DetailField label="Descrição" value={safeValue(product.descricao, 'N/A')} />
        <DetailField label="Fornecedor" value={safeValue(product.fk_fornecedor_cnpj, 'N/A')} />
        <DetailField label="Lote" value={safeValue(product.lote, 'N/A')} />
      </ScrollView>
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}