import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

// Propriedades que o modal precisa para funcionar
interface EditNameModalProps {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export default function EditNameModal({ visible, currentName, onClose, onSave }: EditNameModalProps) {
  // O modal agora gerencia seu próprio estado de input
  const [inputText, setInputText] = useState(currentName);

  // Efeito para atualizar o inputText se o nome mudar enquanto o modal não está visível
  useEffect(() => {
    setInputText(currentName);
  }, [currentName]);

  const handleSave = () => {
    onSave(inputText); // Chama a função de salvar do componente pai
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Alterar Nome</Text>
          <TextInput
            style={styles.input}
            onChangeText={setInputText}
            value={inputText}
            autoFocus={true}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} color="#6b7280" />
            <Button title="Salvar" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Os estilos agora vivem junto com o componente do modal
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});