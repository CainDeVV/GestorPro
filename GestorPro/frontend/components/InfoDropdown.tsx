import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface InfoDropdownProps {
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function InfoDropdown({ title, children, isExpanded = false, onToggle }: InfoDropdownProps) {
  return (
    <View className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row justify-between items-center p-4 bg-gray-50"
      >
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        <FontAwesome
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#374151"
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View className="p-4 border-t border-gray-200">
          {children}
        </View>
      )}
    </View>
  );
}
