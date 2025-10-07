import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { getMembersByYear, Member } from '../../src/api/classroom';
import axios from 'axios';
import { Screen, Header } from '../../src/ui/Screen';
import Card from '../../src/ui/Card';
import { palette, spacing } from '../../src/ui/theme';

export default function MembersScreen() {
  const year = '2565';
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMembersByYear(year);
      setMembers(Array.isArray(res) ? res : []);
    } catch (e) {
      if (axios.isAxiosError(e)) setError(e.response?.data?.error || 'โหลดข้อมูลไม่สำเร็จ');
      else setError('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <Screen>
      <Header title={`รายชื่อสมาชิกปี ${year}`} back />
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="white" />
          <Text style={{ color: palette.sub, marginTop: 8 }}>กำลังโหลด...</Text>
        </View>
      ) : (
        <FlatList
          data={members}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
          keyExtractor={(i) => i._id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: spacing(1) }}>
              <Text style={{ color: palette.text, fontWeight: '700', fontSize: 16 }}>
                {item.firstname} {item.lastname}
              </Text>
              <Text style={{ color: palette.sub }}>{item.email}</Text>
              <Text style={{ color: palette.sub }}>รหัส: {item.education?.studentId ?? '-'}</Text>
              <Text style={{ color: palette.sub }}>สาขา: {item.education?.major ?? '-'}</Text>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={{ color: palette.sub, textAlign: 'center', marginTop: spacing(2) }}>
              ไม่พบข้อมูลปี {year}
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </Screen>
  );
}
