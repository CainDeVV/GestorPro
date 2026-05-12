import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
}

export default function FormInput({ label, ...props }: FormInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-base text-gray-600 mb-1 ml-1">{label}</Text>
      <TextInput
        className="border border-gray-300 bg-white p-3 rounded-md text-base"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
}