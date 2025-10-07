import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { Screen, Header } from '../../src/ui/Screen';
import Card from '../../src/ui/Card';
import Avatar from '../../src/ui/Avatar';
import Button from '../../src/ui/Button';
import { palette, spacing } from '../../src/ui/theme';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <Screen>
      <Header title="โปรไฟล์ของฉัน" back />
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) }}>
          <Avatar size={72} uri={user?.image} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>
              {(user?.firstname || '') + ' ' + (user?.lastname || '')}
            </Text>
            <Text style={{ color: palette.sub }}>{user?.email}</Text>
          </View>
        </View>

        <View style={{ height: spacing(1.5) }} />

        <Card>
          <Text style={{ color: palette.sub, marginBottom: 6 }}>ข้อมูลการศึกษา</Text>
          <Text style={{ color: 'white' }}>
            สาขา: {user?.education?.major ?? '-'}
          </Text>
          <Text style={{ color: 'white' }}>
            รหัสนักศึกษา: {user?.education?.studentId ?? '-'}
          </Text>
          <Text style={{ color: 'white' }}>
            ปีที่เข้าเรียน: {user?.education?.enrollmentYear ?? '-'}
          </Text>
        </Card>

        <View style={{ height: spacing(1.5) }} />

        <Card>
          <Text style={{ color: palette.sub, marginBottom: 6 }}>สถานะผู้ใช้</Text>
          <Text style={{ color: 'white' }}>ประเภท: {user?.type ?? '-'}</Text>
          <Text style={{ color: 'white' }}>สิทธิ์: {user?.role ?? '-'}</Text>
          <View style={{ height: spacing(1) }} />
          <Button title="กลับหน้าแรก" onPress={() => router.replace('/')} />
          <Button title="ออกจากระบบ" danger onPress={signOut} style={{ marginTop: spacing(1) }} />
        </Card>
      </Card>
    </Screen>
  );
}
