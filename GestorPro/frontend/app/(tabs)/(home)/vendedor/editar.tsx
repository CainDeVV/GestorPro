import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FormInput from '../../../../components/FormInput';
import SaveConfirmationModal from '../../../../components/SaveConfirmationModal';
import { Vendor } from '../../../../types';
import { getVendorByCpf, updateVendor } from '../../../../services/api';

export default function EditarVendedorScreen() {
  const router = useRouter();
  const { id: cpf } = useLocalSearchParams<{ id: string }>();

  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [telefone, setTelefone] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cpf) return;
    const loadVendor = async () => {
      try {
        const vendorToEdit = await getVendorByCpf(cpf);
        if (vendorToEdit) {
          setNome(vendorToEdit.nome);
          setApelido(vendorToEdit.apelido);
          setTelefone(vendorToEdit.telefone);
        }
      } catch(e) { console.error(e) }
      finally { setIsLoading(false) }
    };
    loadVendor();
  }, [cpf]);

  const handleSave = async () => {
    if (!cpf) return;
    try {
      const updatedData: Vendor = { cpf, nome, apelido, telefone };
      await updateVendor(cpf, updatedData);
      setModalVisible(false);
      Alert.alert("Sucesso", "Vendedor atualizado!");
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando vendedor...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
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
        {/* O CPF é a chave primária, geralmente não é boa prática permitir a edição */}
        <FormInput 
          label="CPF" 
          value={cpf} 
          editable={false}
          placeholder="CPF (não editável)"
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