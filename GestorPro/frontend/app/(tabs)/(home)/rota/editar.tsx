import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FormInput from '../../../../components/FormInput';
import SaveConfirmationModal from '../../../../components/SaveConfirmationModal';
import { getRouteById, updateRoute } from '../../../../services/api';

export default function EditarRotaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // MUDANÇA: Usamos os nomes de estado alinhados com o backend
  const [nome_rota, setNomeRota] = useState('');
  const [descricao_rota, setDescricaoRota] = useState('');
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const routeId = parseInt(id || '0', 10);
    if (!routeId) {
        setIsLoading(false);
        return;
    };
    const loadRoute = async () => {
      try {
        const routeToEdit = await getRouteById(routeId);
        if (routeToEdit) {
          // MUDANÇA: Populamos os estados com os dados corretos
          setNomeRota(routeToEdit.nome_rota);
          setDescricaoRota(routeToEdit.descricao_rota);
        }
      } catch(e) { console.error(e) }
      finally { setIsLoading(false) }
    };
    loadRoute();
  }, [id]);

  const handleSave = async () => {
    const routeId = parseInt(id || '0', 10);
    if (!routeId) return;
    try {
      // MUDANÇA: Enviamos o objeto com as chaves corretas para a API
      await updateRoute(routeId, { nome_rota, descricao_rota });
      setModalVisible(false);
      Alert.alert("Sucesso", "Rota atualizada!");
      if (router.canGoBack()) router.back();
    } catch(e: any) {
      Alert.alert("Erro", e.message || "Não foi possível atualizar a rota.");
    }
  };

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando rota...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* MUDANÇA: Conectamos os inputs aos novos estados */}
        <FormInput 
          label="Nome da Rota" 
          value={nome_rota} 
          onChangeText={setNomeRota}
          placeholder="Digite o nome da rota"
        />
        <FormInput 
          label="Descrição" 
          value={descricao_rota} 
          onChangeText={setDescricaoRota} 
          multiline
          placeholder="Digite uma descrição da rota (opcional)"
        />
        
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-green-600 py-4 rounded-md items-center justify-center mt-6 flex-row"
        >
          <FontAwesome name="save" size={20} color="white" />
          <Text className="text-white text-lg font-bold ml-3">Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
      <SaveConfirmationModal
        visible={isModalVisible}
        itemName="as alterações"
        onConfirm={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}