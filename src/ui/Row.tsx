import React, { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
export default function Row({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}
