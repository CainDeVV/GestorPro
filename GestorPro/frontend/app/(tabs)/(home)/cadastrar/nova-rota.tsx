import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import FormInput from '../../../../components/FormInput';
import SaveConfirmationModal from '../../../../components/SaveConfirmationModal';
import { addRoute } from '../../../../services/api';

export default function NovaRotaScreen() {
  const router = useRouter();
  // Os nomes dos estados podem continuar simples
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSave = async () => {
    setModalVisible(false);
    if (!nome.trim()) {
      Alert.alert("Erro", "O campo 'Nome da Rota' é obrigatório.");
      return;
    }
    try {
      // A CORREÇÃO ESTÁ AQUI:
      // Enviamos um objeto com as chaves que o backend espera: 'nome_rota' e 'descricao_rota'.
      await addRoute({
        nome_rota: nome,
        descricao_rota: descricao 
      });
      Alert.alert("Sucesso", "Nova rota cadastrada!");
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível salvar a rota.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* O formulário não precisa mais do campo 'código' */}
        <FormInput 
          label="Nome da Rota" 
          value={nome} 
          onChangeText={setNome}
          placeholder="Digite o nome da rota"
        />
        <FormInput 
          label="Descrição" 
          value={descricao} 
          onChangeText={setDescricao} 
          multiline
          placeholder="Digite uma descrição da rota (opcional)"
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-green-600 py-4 rounded-md items-center justify-center mt-6 flex-row"
        >
          <FontAwesome name="save" size={20} color="white" />
          <Text className="text-white text-lg font-bold ml-3">Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
      <SaveConfirmationModal
        visible={isModalVisible}
        itemName="Rota"
        onConfirm={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}