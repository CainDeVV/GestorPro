import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useSale } from '../../../../context/SaleContext';
import { Vendor } from '../../../../types';
import { getVendors } from '../../../../services/api';

export default function SelecionarVendedorScreen() {
  const { setVendorForSale } = useSale();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useFocusEffect(useCallback(() => {
    getVendors().then(setVendors).catch(console.error);
  }, []));

  const handleSelect = (vendor: Vendor) => {
    setVendorForSale(vendor);
router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={vendors}
        keyExtractor={(item) => item.nome}
        className="p-4"
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleSelect(item)}
            className="bg-white p-4 rounded-lg shadow-sm mb-3 active:bg-gray-100"
          >
            <Text className="font-bold text-lg">{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}