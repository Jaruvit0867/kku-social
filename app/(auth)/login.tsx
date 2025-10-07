// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { Screen, Header } from '../../src/ui/Screen';
import Button from '../../src/ui/Button';
import Input from '../../src/ui/Input';
import { palette, spacing } from '../../src/ui/theme';
import axios from 'axios';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async () => {
    setErr(null);
    if (!email || !password) {
      setErr('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    try {
      setBusy(true);
      await signIn({ email, password });
    } catch (e: any) {
      const msg =
        (axios.isAxiosError(e) && (e.response?.data as any)?.error) ||
        e?.message ||
        'เข้าสู่ระบบไม่สำเร็จ';
      setErr(msg);
      Alert.alert('เข้าสู่ระบบไม่สำเร็จ', msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Header title="KKU Social" />
      <Text style={{ color: palette.sub, marginBottom: spacing(2) }}>ลงชื่อเข้าใช้ระบบ</Text>
      <View style={{ gap: spacing(1.25), maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <Input
          placeholder="อีเมล"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="รหัสผ่าน"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {err ? <Text style={{ color: '#fca5a5' }}>{err}</Text> : null}
        <Button title="เข้าสู่ระบบ" onPress={onSubmit} loading={busy} />
      </View>
    </Screen>
  );
}
