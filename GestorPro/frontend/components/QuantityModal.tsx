import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Product } from '../types';

interface QuantityModalProps {
  visible: boolean;
  product: Product | null;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export default function QuantityModal({ visible, product, onConfirm, onCancel }: QuantityModalProps) {
  const [quantity, setQuantity] = useState('1');

  const handleConfirm = () => {
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma quantidade válida maior que zero.');
      return;
    }

    if (numQuantity > (product?.quantidade || 0)) {
      Alert.alert('Erro', `Quantidade insuficiente em estoque. Disponível: ${product?.quantidade || 0}`);
      return;
    }

    onConfirm(numQuantity);
    setQuantity('1'); // Reset para próxima vez
  };

  const handleCancel = () => {
    setQuantity('1');
    onCancel();
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center bg-black/50"
      >
        <View className="bg-white rounded-lg p-6 w-80">
          <Text className="text-lg font-bold mb-4 text-center">
            Definir Quantidade
          </Text>
          
          <Text className="text-gray-600 mb-2">
            Produto: <Text className="font-semibold">{product.nome}</Text>
          </Text>
          
          <Text className="text-gray-600 mb-2">
            Preço: <Text className="font-semibold">R$ {product.preco_venda?.toFixed(2).replace('.', ',') || '0,00'}</Text>
          </Text>
          
          <Text className="text-gray-600 mb-4">
            Estoque: <Text className="font-semibold">{product.quantidade} unidades</Text>
          </Text>

          <Text className="text-gray-700 mb-2">Quantidade:</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            className="border border-gray-300 rounded-md p-3 text-center text-lg"
            placeholder="1"
            maxLength={3}
          />

          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 mr-2 py-3 bg-gray-300 rounded-md"
            >
              <Text className="text-center font-semibold text-gray-700">
                Cancelar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleConfirm}
              className="flex-1 ml-2 py-3 bg-blue-500 rounded-md"
            >
              <Text className="text-center font-semibold text-white">
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
