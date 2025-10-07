import React, { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
import { palette, radius, shadow, spacing } from './theme';

export default function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <View style={[{ backgroundColor: palette.card, borderRadius: radius.md, borderWidth: 1, borderColor: palette.border, padding: spacing(1.5) }, shadow.card, style]}>
      {children}
    </View>
  );
}
