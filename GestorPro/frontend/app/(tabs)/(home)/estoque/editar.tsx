import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FormInput from '../../../../components/FormInput';
import SaveConfirmationModal from '../../../../components/SaveConfirmationModal';
import SupplierSelector from '../../../../components/SupplierSelector';
import { Product } from '../../../../types';
import { getProductById, updateProduct } from '../../../../services/api';

export default function EditarProdutoScreen() {
  const router = useRouter();
  // 'id' aqui conterá o código de barras
  const { id: codigo_barras } = useLocalSearchParams<{ id: string }>();

  // Estados para os campos simplificados
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('');
  // Adicionamos os outros campos do backend para consistência
  const [lote, setLote] = useState('');
  const [fk_fornecedor_cnpj, setFkFornecedorCnpj] = useState('');
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Função para tratar valores null/undefined de forma segura
  const safeValue = (value: any, defaultValue: any = '') => {
    return value === null || value === undefined ? defaultValue : value;
  };

  useEffect(() => {
    if (!codigo_barras) return;
    const loadProduct = async () => {
      try {
        const productToEdit = await getProductById(codigo_barras);
        if (productToEdit) {
          setNome(safeValue(productToEdit.nome, ''));
          setPreco(safeValue(productToEdit.preco_venda, 0).toString()); // Usando preco_venda do backend
          setCategoria(safeValue(productToEdit.categoria, ''));
          setQuantidade(safeValue(productToEdit.quantidade, 0).toString());
          // Preenche os outros campos
          setLote(safeValue(productToEdit.lote, ''));
          setFkFornecedorCnpj(safeValue(productToEdit.fk_fornecedor_cnpj, ''));
        }
      } catch(e) { console.error(e) }
      finally { setIsLoading(false) }
    };
    loadProduct();
  }, [codigo_barras]);

  const handleSave = async () => {
    if (!codigo_barras) return;
    try {
      // Monta o objeto completo que o backend espera
      const updatedData: Product = {
        codigo_barras,
        nome: nome || 'Sem nome',
        preco_venda: parseFloat(preco) || 0,
        categoria: categoria || '',
        quantidade: parseInt(quantidade) || 0,
        // Inclui os outros campos
        preco_custo: 0, // Adicione um valor padrão ou um campo no form
        peso: 0, // Adicione um valor padrão ou um campo no form
        descricao: '', // Adicione um valor padrão ou um campo no form
        lote: lote || 'LOTE_PADRAO',
        fk_fornecedor_cnpj: fk_fornecedor_cnpj || '',
      };
      await updateProduct(codigo_barras, updatedData);
      setModalVisible(false);
      Alert.alert("Sucesso", "Produto atualizado!");
      if (router.canGoBack()) router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível atualizar o produto.");
    }
  };

  if (isLoading) {
    return <View className="flex-1 justify-center items-center"><Text>Carregando produto...</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <FormInput 
          label="Nome do Produto" 
          value={nome} 
          onChangeText={setNome}
          placeholder="Digite o nome do produto"
        />
        <FormInput 
          label="Preço de Venda" 
          value={preco} 
          onChangeText={setPreco} 
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
          label="Quantidade" 
          value={quantidade} 
          onChangeText={setQuantidade} 
          keyboardType="numeric"
          placeholder="0"
        />
        <FormInput 
          label="Lote" 
          value={lote} 
          onChangeText={setLote}
          placeholder="Digite o número do lote"
        />
        
        <SupplierSelector
          selectedCnpj={fk_fornecedor_cnpj}
          onSelectSupplier={setFkFornecedorCnpj}
          label="Fornecedor"
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
        itemName="Produto"
        onConfirm={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}