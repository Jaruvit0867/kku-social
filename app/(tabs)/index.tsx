// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Pressable,
  ActivityIndicator,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { Screen, Header } from '../../src/ui/Screen';
import Card from '../../src/ui/Card';
import Button from '../../src/ui/Button';
import Avatar from '../../src/ui/Avatar';
import Input from '../../src/ui/Input';
import { palette, spacing, radius } from '../../src/ui/theme';
import { createStatus, getStatuses, Post } from '../../src/api/status';

// ===== กล่องปุ่มสั้น (ชั้นปี / โปรไฟล์) =====
function ActionTile({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 96,
        backgroundColor: pressed ? '#0d1b3f' : '#0f1833',
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: palette.border,
        padding: spacing(1.25),
        justifyContent: 'space-between',
      })}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#16244d',
        }}
      >
        <Ionicons name={icon} size={22} color="#93c5fd" />
      </View>
      <Text style={{ color: 'white', fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

// ===== Helper: แปลงเวลาโพสต์ =====
const timeAgo = (iso: string) => {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const dd = Math.floor(h / 24);
  if (dd < 7) return `${dd}d`;
  return d.toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const name = user?.firstname || user?.email?.split('@')?.[0] || 'ผู้ใช้';

  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [feed, setFeed] = useState<Post[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // ===== โหลดฟีดย่อบนหน้าแรก =====
  const loadFeed = async () => {
    try {
      setLoadingFeed(true);
      const rows = await getStatuses();
      const sorted = rows
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      setFeed(sorted);
    } catch {
      // เงียบไว้
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  // ===== โพสต์สถานะ =====
  const postNow = async () => {
    const content = text.trim();
    if (!content) return;
    try {
      setPosting(true);
      Keyboard.dismiss();
      await createStatus(content);
      setText('');
      await loadFeed();
    } catch (e: any) {
      Alert.alert(e?.response?.data?.error || 'โพสต์ไม่สำเร็จ');
    } finally {
      setPosting(false);
    }
  };

  // ===== render ฟีดการ์ดย่อ =====
  const renderFeedItem = ({ item }: { item: Post }) => (
    <Card
      style={{
        marginBottom: spacing(1),
        backgroundColor: '#101828',
        borderRadius: 16,
        padding: spacing(2),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1) }}>
        <Ionicons name="person-circle-outline" size={36} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
            {item.createdBy?.firstname
              ? `${item.createdBy.firstname} ${item.createdBy.lastname ?? ''}`
              : item.createdBy?.email?.split('@')[0] ?? 'ไม่ทราบชื่อ'}
          </Text>
          <Text style={{ color: palette.sub, fontSize: 12 }}>{timeAgo(item.createdAt)}</Text>
        </View>
      </View>
      <Text style={{ color: 'white', marginTop: spacing(1.2), fontSize: 15 }}>
        {item.content}
      </Text>
    </Card>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Screen>
          <Header title="หน้าแรก" />

          <View style={{ gap: spacing(2), maxWidth: 820, width: '100%', alignSelf: 'center' }}>
            {/* โปรไฟล์ย่อ + ออกจากระบบ (เพิ่ม margin ให้โล่ง) */}
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) }}>
                <Avatar size={56} uri={user?.image} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }}>
                    สวัสดี, {name}
                  </Text>
                  <Text style={{ color: palette.sub }}>
                    {user?.education?.major
                      ? `สาขา ${user.education.major}`
                      : 'พร้อมเริ่มต้นวันนี้ไหม?'}
                  </Text>
                </View>
                <Button
                  title="ออกจากระบบ"
                  danger
                  onPress={signOut}
                  style={{ marginLeft: spacing(2), marginRight: spacing(1) }}
                  icon={<Ionicons name="log-out-outline" size={18} color="white" />}
                />
              </View>

              {/* composer + ปุ่มโพสต์ (ใช้ไอคอน) */}
              <View
                style={{
                  marginTop: spacing(1.75),
                  backgroundColor: '#0e1426',
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: palette.border,
                  padding: spacing(1.25),
                }}
              >
                <Input
                  placeholder="คุณกำลังคิดอะไรอยู่…"
                  value={text}
                  onChangeText={setText}
                  multiline
                />
                <Button
                  title="โพสต์"
                  onPress={postNow}
                  loading={posting}
                  style={{ marginTop: spacing(1.25) }}
                  icon={<Ionicons name="megaphone-outline" size={18} color="white" />}
                />
              </View>
            </Card>

            {/* ปุ่มชั้นปี / โปรไฟล์ (ไอคอน Ionicons) */}
            <View style={{ flexDirection: 'row', gap: spacing(1.25), width: '100%' }}>
              <ActionTile
                icon="people-outline"
                label="ชั้นปี 2565"
                onPress={() => router.push('/members')}
              />
              <ActionTile
                icon="person-circle-outline"
                label="โปรไฟล์ของฉัน"
                onPress={() => router.push('/profile')}
              />
            </View>

            {/* ฟีดย่อด้านล่าง + ปุ่มดูทั้งหมดแบบไอคอน */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }}>ฟีดล่าสุด</Text>
              <Pressable
                onPress={() => router.push('/feed')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <Text style={{ color: '#93c5fd' }}>ดูทั้งหมด</Text>
                <Ionicons name="chevron-forward" size={18} color="#93c5fd" />
              </Pressable>
            </View>

            {loadingFeed ? (
              <View style={{ alignItems: 'center', paddingVertical: spacing(2) }}>
                <ActivityIndicator color="#fff" />
                <Text style={{ color: palette.sub, marginTop: 6 }}>กำลังโหลดฟีด...</Text>
              </View>
            ) : (
              <FlatList
                data={feed}
                keyExtractor={(i) => i._id}
                renderItem={renderFeedItem}
                contentContainerStyle={{ paddingBottom: spacing(3) }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </Screen>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
