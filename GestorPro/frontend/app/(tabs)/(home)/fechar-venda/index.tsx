import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View, Modal } from 'react-native';
import { Venda } from '../../../../types';
import { getVendasAbertas, fecharVenda } from '../../../../services/api';

export default function FecharVendaScreen() {
  const navigation = useNavigation();
  const [vendasAbertas, setVendasAbertas] = useState<Venda[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadVendasAbertas();
  }, []);

  const loadVendasAbertas = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando vendas abertas...');
      const data = await getVendasAbertas();
      console.log('Vendas abertas carregadas:', data);
      setVendasAbertas(data);
    } catch (error) {
      console.error('Erro ao carregar vendas abertas:', error);
      Alert.alert(
        "Erro", 
        error instanceof Error ? error.message : "Erro ao carregar vendas abertas"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVenda = (id: number) => {
    console.log('Selecionando venda:', id);
    setSelectedIds(prev => {
      const newIds = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      console.log('IDs selecionados:', newIds);
      return newIds;
    });
  };

  const handleFecharVendas = async () => {
    console.log('=== INÍCIO DA FUNÇÃO handleFecharVendas ===');
    console.log('Iniciando fechamento de vendas...');
    console.log('IDs selecionados:', selectedIds);
    console.log('Tipo de selectedIds:', typeof selectedIds);
    console.log('Comprimento de selectedIds:', selectedIds.length);
    
    if (selectedIds.length === 0) {
      console.log('Nenhuma venda selecionada - saindo da função');
      return;
    }

    console.log('Mostrando modal de confirmação...');
    setShowConfirmModal(true);
    console.log('=== FIM DA FUNÇÃO handleFecharVendas ===');
  };

  const confirmarFechamento = async () => {
    console.log('=== USUÁRIO CONFIRMOU O FECHAMENTO ===');
    setShowConfirmModal(false);
    
    try {
      console.log('Confirmado fechamento de vendas');
      console.log('Vou fechar as vendas com IDs:', selectedIds);
      
      // Fechar todas as vendas selecionadas
      const promises = selectedIds.map(id => {
        console.log('Criando promise para fechar venda ID:', id);
        return fecharVenda(id);
      });
      
      console.log('Executando todas as promises...');
      await Promise.all(promises);
      console.log('Todas as vendas foram fechadas com sucesso');
      
      Alert.alert("Sucesso", `${selectedIds.length} venda(s) fechada(s) com sucesso!`);
      setSelectedIds([]);
      console.log('Recarregando lista de vendas...');
      loadVendasAbertas(); // Recarregar a lista
    } catch (error) {
      console.error('=== ERRO AO FECHAR VENDAS ===');
      console.error('Erro completo:', error);
      console.error('Tipo do erro:', typeof error);
      console.error('Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido');
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao fechar vendas"
      );
    }
  };

  const cancelarFechamento = () => {
    console.log('Usuário cancelou o fechamento');
    setShowConfirmModal(false);
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

  const renderVenda = ({ item }: { item: Venda }) => (
    <TouchableOpacity
      onPress={() => handleSelectVenda(item.id_venda)}
      className={`p-4 rounded-lg mb-2 shadow-sm ${
        selectedIds.includes(item.id_venda) ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            Venda #{item.id_venda}
          </Text>
          <Text className="text-gray-600">📅 {formatDate(item.data_venda)}</Text>
          <Text className="text-gray-600">👤 Vendedor: {item.fk_vendedor_cpf}</Text>
          <Text className="text-gray-600">🗺️ Rota: {item.fk_rota_id_rota}</Text>
          {item.fk_cliente_id_cliente && (
            <Text className="text-gray-600">👥 Cliente: {item.fk_cliente_id_cliente}</Text>
          )}
          <Text className="text-green-600 font-semibold">🟢 {item.status_venda}</Text>
        </View>
        <View className="items-center">
          {selectedIds.includes(item.id_venda) && (
            <FontAwesome name="check-circle" size={24} color="#3b82f6" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Efeito para criar o cabeçalho dinâmico com o botão de fechar
  useLayoutEffect(() => {
    console.log('Atualizando cabeçalho, IDs selecionados:', selectedIds);
    navigation.setOptions({
      title: selectedIds.length === 0 ? 'Fechar Venda' : `${selectedIds.length} selecionada(s)`,
      headerRight: () => {
        if (selectedIds.length > 0) {
          return (
            <TouchableOpacity 
              onPress={() => {
                console.log('=== BOTÃO FOI PRESSIONADO ===');
                console.log('Chamando handleFecharVendas...');
                handleFecharVendas();
              }}
              style={{ padding: 10 }}
            >
              <FontAwesome name="check" size={24} color="#10b981" />
            </TouchableOpacity>
          );
        }
        return null;
      },
    });
  }, [navigation, selectedIds]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Carregando vendas abertas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={vendasAbertas}
        keyExtractor={(item) => item.id_venda.toString()}
        className="p-4"
        renderItem={renderVenda}
        refreshing={isLoading}
        onRefresh={loadVendasAbertas}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <FontAwesome name="shopping-cart" size={64} color="#9ca3af" />
            <Text className="text-lg text-gray-600 mt-4">Nenhuma venda aberta</Text>
            <Text className="text-gray-500 text-center mt-2">
              Todas as vendas já foram fechadas
            </Text>
          </View>
        }
      />

      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Confirmar Fechamento</Text>
            <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
              Tem certeza que deseja fechar {selectedIds.length} venda(s)?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <TouchableOpacity
                style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 5 }}
                onPress={cancelarFechamento}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5 }}
                onPress={confirmarFechamento}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}