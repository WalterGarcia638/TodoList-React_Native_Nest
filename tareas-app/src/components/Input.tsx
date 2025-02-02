// src/components/Input.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

const Input = (props: TextInputProps) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
});

export default Input;
