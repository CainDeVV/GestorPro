import React from 'react';
import { Alert, AlertButton } from 'react-native';

interface ErrorAlertProps {
  title?: string;
  message: string;
  buttons?: AlertButton[];
}

/**
 * Componente para exibir alertas de erro de forma mais amigável
 * Especialmente útil para mensagens de erro do backend que contêm formatação
 */
export const showErrorAlert = ({ 
  title = "Erro", 
  message, 
  buttons = [{ text: "OK" }] 
}: ErrorAlertProps) => {
  // Remove quebras de linha extras e formata a mensagem
  const formattedMessage = message
    .replace(/\n\n+/g, '\n\n') // Remove múltiplas quebras de linha
    .trim();
  
  Alert.alert(title, formattedMessage, buttons);
};

/**
 * Função específica para erros de exclusão com dependências
 */
export const showDeletionErrorAlert = (message: string) => {
  showErrorAlert({
    title: "⚠️ Não é possível excluir",
    message: message,
    buttons: [
      { text: "Entendi", style: "default" },
      { 
        text: "Ver vendas", 
        style: "default",
        onPress: () => {
          // Aqui você pode adicionar navegação para a tela de vendas
          console.log("Navegar para vendas");
        }
      }
    ]
  });
};

/**
 * Função específica para erros de exclusão de vendedores
 */
export const showVendorDeletionErrorAlert = (message: string) => {
  showErrorAlert({
    title: "⚠️ Não é possível excluir vendedor",
    message: message,
    buttons: [
      { text: "Entendi", style: "default" },
      { 
        text: "Ver vendas", 
        style: "default",
        onPress: () => {
          // Aqui você pode adicionar navegação para a tela de vendas
          console.log("Navegar para vendas");
        }
      },
      { 
        text: "Ver expedições", 
        style: "default",
        onPress: () => {
          // Aqui você pode adicionar navegação para a tela de expedições
          console.log("Navegar para expedições");
        }
      }
    ]
  });
};

/**
 * Função específica para erros de exclusão de fornecedores
 */
export const showSupplierDeletionErrorAlert = (message: string) => {
  showErrorAlert({
    title: "⚠️ Não é possível excluir fornecedor",
    message: message,
    buttons: [
      { text: "Entendi", style: "default" },
      { 
        text: "Ver produtos", 
        style: "default",
        onPress: () => {
          // Aqui você pode adicionar navegação para a tela de produtos
          console.log("Navegar para produtos");
        }
      }
    ]
  });
};

/**
 * Função específica para erros de exclusão de clientes
 */
export const showClienteDeletionErrorAlert = (message: string) => {
  showErrorAlert({
    title: "⚠️ Não é possível excluir cliente",
    message: message,
    buttons: [
      { text: "Entendi", style: "default" },
      { 
        text: "Ver vendas", 
        style: "default",
        onPress: () => {
          // Aqui você pode adicionar navegação para a tela de vendas
          console.log("Navegar para vendas");
        }
      }
    ]
  });
};

export default showErrorAlert; 