import React from 'react';
import { Text, View } from 'react-native';

interface StatRowProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function StatRow({ label, value, color }: StatRowProps) {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
      <Text className="text-base text-gray-600">{label}</Text>
      <Text className={`text-base font-bold ${color || 'text-gray-800'}`}>{value}</Text>
    </View>
  );
}