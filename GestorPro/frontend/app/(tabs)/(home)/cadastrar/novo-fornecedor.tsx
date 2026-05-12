import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import FormInput from '../../../../components/FormInput';
import SaveConfirmationModal from '../../../../components/SaveConfirmationModal';
import { addSupplier } from '../../../../services/api';

export default function NovoFornecedorScreen() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [telefone_contato, setTelefoneContato] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSave = async () => {
    setModalVisible(false);
    if (!nome.trim() || !cnpj.trim()) {
      Alert.alert("Erro", "Os campos 'Nome' e 'CNPJ' são obrigatórios.");
      return;
    }
    try {
      await addSupplier({ 
        cnpj, 
        nome, 
        telefone_contato: telefone_contato || undefined,
        email: email || undefined,
        endereco: endereco || undefined
      });
      Alert.alert("Sucesso", "Novo fornecedor cadastrado!");
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      let errorMessage = "Não foi possível salvar o fornecedor.";
      
      if (error.message) {
        if (error.message.includes("CNPJ já cadastrado")) {
          errorMessage = "Este CNPJ já está cadastrado. Use um CNPJ diferente.";
        } else if (error.message.includes("Erro de conexão")) {
          errorMessage = "Erro de conexão com o servidor. Verifique se o backend está rodando.";
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <FormInput 
          label="CNPJ" 
          value={cnpj} 
          onChangeText={setCnpj} 
          keyboardType="numeric"
          placeholder="Digite o CNPJ da empresa"
        />
        <FormInput 
          label="Nome da Empresa" 
          value={nome} 
          onChangeText={setNome}
          placeholder="Digite o nome da empresa"
        />
        <FormInput 
          label="Telefone" 
          value={telefone_contato} 
          onChangeText={setTelefoneContato} 
          keyboardType="phone-pad"
          placeholder="Digite o telefone"
        />
        <FormInput 
          label="Email" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          placeholder="Digite o email (opcional)"
        />
        <FormInput 
          label="Endereço" 
          value={endereco} 
          onChangeText={setEndereco} 
          multiline
          placeholder="Digite o endereço (opcional)"
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
        itemName="Fornecedor"
        onConfirm={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
} 