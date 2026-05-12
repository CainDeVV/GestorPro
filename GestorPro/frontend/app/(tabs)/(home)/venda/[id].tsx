import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Venda, Cliente, Vendor, Route, ItemVendaResponse } from '../../../../types';
import { getVendaById, deleteVenda, getItensVenda } from '../../../../services/api';
import { getClienteById } from '../../../../services/api';
import { getVendorByCpf } from '../../../../services/api';
import { getRouteById } from '../../../../services/api';
import InfoDropdown from '../../../../components/InfoDropdown';
import { BASE_URL } from '../../../../services/api';

export default function VendaDetalhesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [venda, setVenda] = useState<Venda | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [vendedor, setVendedor] = useState<Vendor | null>(null);
  const [rota, setRota] = useState<Route | null>(null);
  const [itens, setItens] = useState<ItemVendaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{
    cliente: boolean;
    vendedor: boolean;
    rota: boolean;
    itens: boolean;
  }>({
    cliente: false,
    vendedor: false,
    rota: false,
    itens: false,
  });

  useEffect(() => {
    if (id) {
      loadVenda(parseInt(id));
    }
  }, [id]);

  const loadVenda = async (vendaId: number) => {
    try {
      setIsLoading(true);
      const data = await getVendaById(vendaId);
      setVenda(data);
      
      // Carregar informações detalhadas
      await Promise.all([
        loadCliente(data.fk_cliente_id_cliente),
        loadVendedor(data.fk_vendedor_cpf),
        loadRota(data.fk_rota_id_rota),
        loadItens(vendaId),
      ]);
    } catch (error) {
      console.error('Erro ao carregar venda:', error);
      Alert.alert(
        "Erro", 
        error instanceof Error ? error.message : "Erro ao carregar venda"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadCliente = async (clienteId: number | null) => {
    if (clienteId) {
      try {
        const data = await getClienteById(clienteId);
        setCliente(data);
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
      }
    }
  };

  const loadVendedor = async (cpf: string) => {
    try {
      const data = await getVendorByCpf(cpf);
      setVendedor(data);
    } catch (error) {
      console.error('Erro ao carregar vendedor:', error);
    }
  };

  const loadRota = async (rotaId: number) => {
    try {
      const data = await getRouteById(rotaId);
      setRota(data);
    } catch (error) {
      console.error('Erro ao carregar rota:', error);
    }
  };

  const loadItens = async (vendaId: number) => {
    try {
      const data = await getItensVenda(vendaId);
      setItens(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDeleteVenda = async () => {
    console.log('=== BOTÃO EXCLUIR CLICADO ===');
    console.log('Venda atual:', venda);
    
    if (!venda) {
      console.log('Venda não encontrada, retornando...');
      return;
    }

    console.log('=== INICIANDO EXCLUSÃO DIRETA ===');
    console.log('Chamando deleteVenda com ID:', venda.id_venda);
    
    try {
      await deleteVenda(venda.id_venda);
      console.log('Venda deletada com sucesso!');
      Alert.alert("Sucesso", "Venda excluída com sucesso!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('=== ERRO AO EXCLUIR VENDA ===');
      console.error('Erro completo:', error);
      console.error('Tipo do erro:', typeof error);
      console.error('Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido');
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao excluir venda"
      );
    }finally{
      router.push('/venda')
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Carregando venda...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!venda) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Venda não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">
              Venda #{venda.id_venda}
            </Text>
            <TouchableOpacity 
              onPress={handleDeleteVenda}
              className="bg-red-600 px-4 py-2 rounded-md"
            >
              <Text className="text-white font-semibold">Excluir</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Informações da Venda
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">ID da Venda:</Text>
                <Text className="font-semibold">#{venda.id_venda}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Data:</Text>
                <Text className="font-semibold">{formatDate(venda.data_venda)}</Text>
              </View>
              
              {venda.nome_venda && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Nome da Venda:</Text>
                  <Text className="font-semibold">{venda.nome_venda}</Text>
                </View>
              )}
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Status:</Text>
                <Text className={`font-semibold ${
                  venda.status_venda === 'aberta' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {venda.status_venda === 'aberta' ? '🟢 Aberta' : '🔴 Fechada'}
                </Text>
              </View>
            </View>
          </View>

          {/* Dropdown do Cliente */}
          {cliente && (
            <InfoDropdown
              title="📋 Informações do Cliente"
              isExpanded={expandedSections.cliente}
              onToggle={() => toggleSection('cliente')}
            >
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">ID:</Text>
                  <Text className="font-semibold">#{cliente.id_cliente}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Nome:</Text>
                  <Text className="font-semibold">{cliente.nome}</Text>
                </View>
                {cliente.endereco && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Endereço:</Text>
                    <Text className="font-semibold">{cliente.endereco}</Text>
                  </View>
                )}
                {cliente.telefone && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Telefone:</Text>
                    <Text className="font-semibold">{cliente.telefone}</Text>
                  </View>
                )}
                {cliente.cpf_cnpj && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">CPF/CNPJ:</Text>
                    <Text className="font-semibold">{cliente.cpf_cnpj}</Text>
                  </View>
                )}
              </View>
            </InfoDropdown>
          )}

          {/* Dropdown do Vendedor */}
          {vendedor && (
            <InfoDropdown
              title="👤 Informações do Vendedor"
              isExpanded={expandedSections.vendedor}
              onToggle={() => toggleSection('vendedor')}
            >
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">CPF:</Text>
                  <Text className="font-semibold">{vendedor.cpf}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Nome:</Text>
                  <Text className="font-semibold">{vendedor.nome}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Apelido:</Text>
                  <Text className="font-semibold">{vendedor.apelido}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Telefone:</Text>
                  <Text className="font-semibold">{vendedor.telefone}</Text>
                </View>
              </View>
            </InfoDropdown>
          )}

          {/* Dropdown da Rota */}
          {rota && (
            <InfoDropdown
              title="🗺️ Informações da Rota"
              isExpanded={expandedSections.rota}
              onToggle={() => toggleSection('rota')}
            >
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">ID da Rota:</Text>
                  <Text className="font-semibold">#{rota.id_rota}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Nome da Rota:</Text>
                  <Text className="font-semibold">{rota.nome_rota}</Text>
                </View>
                {rota.descricao_rota && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Descrição:</Text>
                    <Text className="font-semibold">{rota.descricao_rota}</Text>
                  </View>
                )}
              </View>
            </InfoDropdown>
          )}

          {/* Dropdown dos Itens */}
          {itens.length > 0 && (
            <InfoDropdown
              title="📦 Itens da Venda"
              isExpanded={expandedSections.itens}
              onToggle={() => toggleSection('itens')}
            >
              <View className="space-y-4">
                {itens.map((item, index) => (
                  <View key={index} className="bg-gray-50 p-3 rounded-md">
                    <View className="flex-row justify-between mb-2">
                      <Text className="font-semibold text-gray-800">{item.nome_produto}</Text>
                      <Text className="text-gray-600">#{item.fk_produto_codigo_barras}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Quantidade:</Text>
                      <Text className="font-semibold">{item.quantidade_vendida}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Preço Unitário:</Text>
                      <Text className="font-semibold">{formatCurrency(item.preco_unitario_venda)}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Total do Item:</Text>
                      <Text className="font-semibold text-green-600">
                        {formatCurrency(item.quantidade_vendida * item.preco_unitario_venda)}
                      </Text>
                    </View>
                  </View>
                ))}
                <View className="border-t border-gray-200 pt-3 mt-3">
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-bold text-gray-800">Total da Venda:</Text>
                    <Text className="text-lg font-bold text-green-600">
                      {formatCurrency(itens.reduce((total, item) => 
                        total + (item.quantidade_vendida * item.preco_unitario_venda), 0
                      ))}
                    </Text>
                  </View>
                </View>
              </View>
            </InfoDropdown>
          )}

          <View className="mt-6 space-y-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-600 py-4 rounded-md items-center"
            >
              <Text className="text-white text-lg font-bold">Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 