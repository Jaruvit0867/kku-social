import React from 'react';
import { Image } from 'react-native';
export default function Avatar({ uri, size = 40 }: { uri?: string; size?: number }) {
  return <Image source={{ uri: uri || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80' }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#0f172a' }} />;
}
