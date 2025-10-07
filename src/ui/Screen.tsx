import React, { PropsWithChildren } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { palette, spacing } from './theme';
import { Ionicons } from '@expo/vector-icons';

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing(2), paddingBottom: spacing(2) }}>
        {children}
      </View>
    </SafeAreaView>
  );
}

export function Header({
  title, back,
}: { title: string; back?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ marginTop: Math.max(insets.top ? 4 : 0, 4), marginBottom: spacing(1), flexDirection: 'row', alignItems: 'center', gap: spacing(1) }}>
      {back ? (
        <Pressable onPress={() => router.back()} style={{ backgroundColor: '#1e3a8a', padding: spacing(1), borderRadius: 10 }}>
          <Ionicons name="chevron-back" size={18} color="white" />
        </Pressable>
      ) : null}
      <Text style={{ color: 'white', fontSize: 22, fontWeight: '800' }}>{title}</Text>
    </View>
  );
}
