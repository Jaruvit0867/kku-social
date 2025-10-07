import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { palette, radius, spacing } from './theme';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={palette.sub}
      style={{
        backgroundColor: palette.card,
        color: 'white',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: palette.border,
        paddingHorizontal: spacing(2),
        paddingVertical: spacing(1.25),
      }}
      {...props}
    />
  );
}
