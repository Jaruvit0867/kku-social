import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { palette, radius, spacing } from './theme';

export default function Button({
  title, onPress, loading, danger, style,
}: { title: string; onPress?: () => void; loading?: boolean; danger?: boolean; style?: ViewStyle }) {
  const bg = danger ? palette.danger : palette.primary;
  const bgPressed = danger ? '#dc2626' : palette.primary600;
  return (
    <Pressable onPress={onPress} disabled={loading}
      style={({ pressed }) => [{ backgroundColor: pressed ? bgPressed : bg, paddingVertical: spacing(1.5), borderRadius: radius.md, alignItems: 'center' }, style]}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: 'white', fontWeight: '700' }}>{title}</Text>}
    </Pressable>
  );
}
