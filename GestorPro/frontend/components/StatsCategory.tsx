import React from 'react';
import { View, Text } from 'react-native';
import StatRow from './StatRow';

interface StatsCategoryProps {
  title: string;
  icon?: string;
  stats: Array<{
    label: string;
    value: number | string;
    color?: string;
  }>;
  backgroundColor?: string;
}

export default function StatsCategory({ 
  title, 
  icon, 
  stats, 
  backgroundColor = "bg-white" 
}: StatsCategoryProps) {
  return (
    <View className={`${backgroundColor} p-4 rounded-lg shadow-sm mb-6`}>
      <View className="flex-row items-center mb-4">
        {icon && (
          <Text className="text-2xl mr-2">{icon}</Text>
        )}
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>
      
      {stats.map((stat, index) => (
        <StatRow 
          key={index}
          label={stat.label} 
          value={stat.value}
          color={stat.color}
        />
      ))}
    </View>
  );
}
