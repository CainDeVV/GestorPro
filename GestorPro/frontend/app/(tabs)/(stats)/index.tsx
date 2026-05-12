import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import EditNameModal from '../../../components/EditNameModal';
import ProfileCard from '../../../components/ProfileCard';
import StatsCategory from '../../../components/StatsCategory';
import LowStockAlert from '../../../components/LowStockAlert';
import { getEstatisticasGerais, getProductsLowStock } from '../../../services/api';
import { Product } from '../../../types';

interface Estatisticas {
  vendas: {
    total: number;
    pendentes: number;
    fechadas: number;
  };
  financeiro: {
    faturamentoTotal: number;
    valorPendente: number;
  };
  estoque: {
    totalProdutos: number;
    produtosEstoqueBaixo: number;
    produtosSemEstoque: number;
  };
  pessoas: {
    totalClientes: number;
    totalVendedores: number;
    totalFornecedores: number;
  };
  operacional: {
    totalRotas: number;
  };
}

export default function StatsScreen() {
  const router = useRouter();
  const [name, setName] = useState('Nome do Individuo');
  const [isModalVisible, setModalVisible] = useState(false);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carrega estatísticas e produtos com estoque baixo em paralelo
      const [dados, produtosBaixoEstoque] = await Promise.all([
        getEstatisticasGerais(),
        getProductsLowStock(10)
      ]);
      
      setEstatisticas(dados);
      setLowStockProducts(produtosBaixoEstoque);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = (newName: string) => {
    setName(newName);
    setModalVisible(false);
  };

  const handleProductPress = (product: Product) => {
    // Navega para a tela de edição do produto
    router.push(`/estoque/${product.codigo_barras}`);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Carregando estatísticas...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-600 text-center mb-4">{error}</Text>
        <Text 
          className="text-blue-600 underline"
          onPress={carregarDados}
        >
          Tentar novamente
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <View className="p-4">
          
          <ProfileCard
            name={name}
            onPress={() => setModalVisible(true)}
          />

          {/* Alerta de Estoque Baixo */}
          <LowStockAlert 
            products={lowStockProducts}
            onProductPress={handleProductPress}
          />

          {estatisticas && (
            <>
              {/* Seção 1: Vendas */}
              <StatsCategory
                title="📊 Vendas"
                icon="📊"
                backgroundColor="bg-blue-50"
                stats={[
                  { label: "Total de vendas", value: estatisticas.vendas.total },
                  { label: "Vendas fechadas", value: estatisticas.vendas.fechadas, color: "text-green-600" },
                  { label: "Vendas pendentes", value: estatisticas.vendas.pendentes, color: "text-orange-600" }
                ]}
              />

              {/* Seção 2: Financeiro */}
              <StatsCategory
                title="💰 Financeiro"
                icon="💰"
                backgroundColor="bg-green-50"
                stats={[
                  { label: "Faturamento total", value: formatarMoeda(estatisticas.financeiro.faturamentoTotal), color: "text-green-600" },
                  { label: "Valor pendente", value: formatarMoeda(estatisticas.financeiro.valorPendente), color: "text-orange-600" }
                ]}
              />

              {/* Seção 3: Estoque */}
              <StatsCategory
                title="📦 Estoque"
                icon="📦"
                backgroundColor="bg-yellow-50"
                stats={[
                  { label: "Total de produtos", value: estatisticas.estoque.totalProdutos },
                  { label: "Produtos em estoque baixo", value: estatisticas.estoque.produtosEstoqueBaixo, color: "text-orange-600" },
                  { label: "Produtos sem estoque", value: estatisticas.estoque.produtosSemEstoque, color: "text-red-600" }
                ]}
              />

              {/* Seção 4: Pessoas */}
              <StatsCategory
                title="👥 Pessoas"
                icon="👥"
                backgroundColor="bg-purple-50"
                stats={[
                  { label: "Total de clientes", value: estatisticas.pessoas.totalClientes },
                  { label: "Total de vendedores", value: estatisticas.pessoas.totalVendedores },
                  { label: "Total de fornecedores", value: estatisticas.pessoas.totalFornecedores }
                ]}
              />

              {/* Seção 5: Operacional */}
              <StatsCategory
                title="🗺️ Operacional"
                icon="🗺️"
                backgroundColor="bg-indigo-50"
                stats={[
                  { label: "Total de rotas", value: estatisticas.operacional.totalRotas }
                ]}
              />
            </>
          )}
        </View>
      </ScrollView>

      <EditNameModal
        visible={isModalVisible}
        currentName={name}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveName}
      />
    </SafeAreaView>
  );
}