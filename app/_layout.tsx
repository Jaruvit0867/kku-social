import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
