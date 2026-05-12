import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import FormInput from '../../../../components/FormInput';
import SaveConfirmationModal from '../../../../components/SaveConfirmationModal';
import { addVendor } from '../../../../services/api';

export default function NovoVendedorScreen() {
  const router = useRouter();
  // Removemos 'codigo' e adicionamos 'apelido'
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSave = async () => {
    setModalVisible(false);
    if (!nome.trim() || !cpf.trim()) {
      Alert.alert("Erro", "Os campos 'Nome' e 'CPF' são obrigatórios.");
      return;
    }
    try {
      // A CORREÇÃO ESTÁ AQUI:
      // Enviamos um objeto com as chaves que o backend espera: cpf, nome, apelido, telefone
      await addVendor({ cpf, nome, apelido, telefone });
      Alert.alert("Sucesso", "Novo vendedor cadastrado!");
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível salvar o vendedor.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Removemos o campo 'código' e adicionamos o 'apelido' */}
        <FormInput 
          label="Nome" 
          value={nome} 
          onChangeText={setNome}
          placeholder="Digite o nome completo"
        />
        <FormInput 
          label="Apelido" 
          value={apelido} 
          onChangeText={setApelido}
          placeholder="Digite o apelido"
        />
        <FormInput 
          label="CPF" 
          value={cpf} 
          onChangeText={setCpf} 
          keyboardType="numeric"
          placeholder="Digite o CPF"
        />
        <FormInput 
          label="Telefone" 
          value={telefone} 
          onChangeText={setTelefone} 
          keyboardType="phone-pad"
          placeholder="Digite o telefone"
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
        itemName="Vendedor"
        onConfirm={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}