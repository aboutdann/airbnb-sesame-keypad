import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DisplayProps {
  value: string;
  placeholder?: string;
}

const Display: React.FC<DisplayProps> = ({ value, placeholder = 'Enter PIN' }) => {
  const maskedValue = value.replace(/./g, '●');

  return (
    <View style={[styles.container, value && styles.containerActive]}>
      <Text style={styles.text}>{maskedValue || placeholder}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    marginHorizontal: 20,
    marginVertical: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerActive: {
    borderColor: '#4ade80',
  },
  text: {
    fontSize: 36,
    fontWeight: '600',
    letterSpacing: 8,
    color: '#4ade80',
  },
});

export default Display;

