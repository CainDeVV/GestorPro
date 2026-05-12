import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FormInput from '../../../../components/FormInput';
import SaveConfirmationModal from '../../../../components/SaveConfirmationModal';
import SupplierSelector from '../../../../components/SupplierSelector';
import { addProduct } from '../../../../services/api';

export default function NovoProdutoScreen() {
  const router = useRouter();
  const [codigo_barras, setCodigoBarras] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco_venda, setPrecoVenda] = useState('');
  const [preco_custo, setPrecoCusto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [peso, setPeso] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fk_fornecedor_cnpj, setFkFornecedorCnpj] = useState('');
  const [useManualCnpj, setUseManualCnpj] = useState(false);
  const [manualCnpj, setManualCnpj] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSave = async () => {
    setModalVisible(false);
    if (!nome.trim() || !codigo_barras.trim()) {
      Alert.alert("Erro", "Código de Barras e Nome são obrigatórios.");
      return;
    }
    
    // Determina qual CNPJ usar
    const fornecedorCnpj = useManualCnpj ? manualCnpj : fk_fornecedor_cnpj;
    
    if (!fornecedorCnpj.trim()) {
      Alert.alert("Erro", "É necessário selecionar um fornecedor ou inserir um CNPJ válido.");
      return;
    }
    
    try {
      await addProduct({
        codigo_barras,
        nome,
        quantidade: parseInt(quantidade) || 0,
        preco_venda: parseFloat(preco_venda) || 0,
        preco_custo: parseFloat(preco_custo) || 0,
        categoria: categoria || '',
        peso: parseFloat(peso) || 0,
        descricao: descricao || '',
        fk_fornecedor_cnpj: fornecedorCnpj,
        lote: 'LOTE_PADRAO', // Adicione um valor padrão ou um novo campo no form
      });
      Alert.alert("Sucesso", "Novo produto cadastrado!");
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível salvar o produto.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <FormInput 
          label="Código de Barras" 
          value={codigo_barras} 
          onChangeText={setCodigoBarras}
          placeholder="Digite o código de barras do produto"
        />
        <FormInput 
          label="Nome do Produto" 
          value={nome} 
          onChangeText={setNome}
          placeholder="Digite o nome do produto"
        />
        <FormInput 
          label="Preço de Venda" 
          value={preco_venda} 
          onChangeText={setPrecoVenda} 
          keyboardType="numeric"
          placeholder="0,00"
        />
        <FormInput 
          label="Preço de Custo" 
          value={preco_custo} 
          onChangeText={setPrecoCusto} 
          keyboardType="numeric"
          placeholder="0,00"
        />
        <FormInput 
          label="Categoria" 
          value={categoria} 
          onChangeText={setCategoria}
          placeholder="Digite a categoria do produto"
        />
        <FormInput 
          label="Peso (Kg)" 
          value={peso} 
          onChangeText={setPeso} 
          keyboardType="numeric"
          placeholder="0,00"
        />
        <FormInput 
          label="Quantidade" 
          value={quantidade} 
          onChangeText={setQuantidade} 
          keyboardType="numeric"
          placeholder="0"
        />
        <FormInput 
          label="Descrição" 
          value={descricao} 
          onChangeText={setDescricao} 
          multiline
          placeholder="Digite uma descrição do produto (opcional)"
        />
        
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Fornecedor</Text>
          <View className="flex-row space-x-2 mb-2">
            <TouchableOpacity
              onPress={() => setUseManualCnpj(false)}
              className={`flex-1 py-2 px-4 rounded-md ${!useManualCnpj ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <Text className={`text-center ${!useManualCnpj ? 'text-white' : 'text-gray-600'}`}>
                Selecionar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUseManualCnpj(true)}
              className={`flex-1 py-2 px-4 rounded-md ${useManualCnpj ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <Text className={`text-center ${useManualCnpj ? 'text-white' : 'text-gray-600'}`}>
                Inserir CNPJ
              </Text>
            </TouchableOpacity>
          </View>
          
          {useManualCnpj ? (
            <FormInput 
              label="CNPJ do Fornecedor" 
              value={manualCnpj} 
              onChangeText={setManualCnpj}
              placeholder="Digite o CNPJ do fornecedor"
            />
          ) : (
            <SupplierSelector
              selectedCnpj={fk_fornecedor_cnpj}
              onSelectSupplier={setFkFornecedorCnpj}
              label=""
            />
          )}
        </View>

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
        itemName="Produto"
        onConfirm={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}