// app/(tabs)/feed.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getStatuses,
  createStatus,
  likeStatus,
  unlikeStatus,
  addComment,
  deleteComment,
  deleteStatus,
  Post,
} from '../../src/api/status';
import { useAuth } from '../../src/providers/AuthProvider';
import { Screen, Header } from '../../src/ui/Screen';
import Card from '../../src/ui/Card';
import Button from '../../src/ui/Button';
import Input from '../../src/ui/Input';
import Row from '../../src/ui/Row';
import Avatar from '../../src/ui/Avatar';
import { palette, spacing } from '../../src/ui/theme';

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

export default function FeedScreen() {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<Post[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const listRef = useRef<FlatList<Post>>(null);

  // โหลดโพสต์
  const load = async () => {
    try {
      setLoading(true);
      const rows = await getStatuses();
      const sorted = rows
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      setStatuses(sorted);
    } catch {
      Alert.alert('โหลดฟีดไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // สร้างโพสต์ใหม่
  const onCreate = async () => {
    const content = newStatus.trim();
    if (!content) return;
    setPosting(true);
    try {
      await createStatus(content);
      setNewStatus('');
      await load();
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch {
      Alert.alert('โพสต์ไม่สำเร็จ');
    } finally {
      setPosting(false);
    }
  };

  // ไลค์ / ยกเลิกไลค์
  const toggleLike = async (p: Post) => {
    try {
      const likedByMe = p.like?.some(
        (x: any) => x?.userId === user?._id || x?._id === user?._id
      );
      if (likedByMe) await unlikeStatus(p._id);
      else await likeStatus(p._id);
      await load();
    } catch {
      Alert.alert('กดไลก์ไม่สำเร็จ');
    }
  };

  // ส่งคอมเมนต์
  const onSubmitComment = async (postId: string) => {
    const text = (commentDraft[postId] || '').trim();
    if (!text) return;
    try {
      await addComment(postId, text);
      setCommentDraft((d) => ({ ...d, [postId]: '' }));
      await load();
    } catch {
      Alert.alert('คอมเมนต์ไม่สำเร็จ');
    }
  };

  // ลบคอมเมนต์
  const onDeleteComment = (commentId: string, statusId: string) => {
    Alert.alert('ยืนยัน', 'ลบคอมเมนต์นี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(commentId, statusId);
            await load();
          } catch {
            Alert.alert('ลบคอมเมนต์ไม่สำเร็จ');
          }
        },
      },
    ]);
  };

  // ลบโพสต์
  const onDeletePost = (postId: string) => {
    Alert.alert('ยืนยัน', 'ลบโพสต์นี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStatus(postId);
            await load();
          } catch {
            Alert.alert('ลบโพสต์ไม่สำเร็จ');
          }
        },
      },
    ]);
  };

  // Render item
  const renderItem = ({ item }: { item: Post }) => {
    const isMyPost = item.createdBy?.email === user?.email;
    const isOpen = !!expanded[item._id];

    return (
      <Card
        style={{
          marginBottom: spacing(1.5),
          backgroundColor: '#101828',
          borderRadius: 16,
          padding: spacing(2),
        }}
      >
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Row style={{ gap: spacing(1), alignItems: 'center' }}>
            <Ionicons name="person-circle-outline" size={36} color="#fff" />
            <View>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
                {item.createdBy?.email.split('@')[0]}
              </Text>
              <Text style={{ color: palette.sub, fontSize: 12 }}>
                {timeAgo(item.createdAt)}
              </Text>
            </View>
          </Row>
          {isMyPost && (
            <TouchableOpacity onPress={() => onDeletePost(item._id)}>
              <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
            </TouchableOpacity>
          )}
        </Row>

        <Text style={{ color: 'white', marginTop: spacing(1.2), fontSize: 15 }}>
          {item.content}
        </Text>

        <Row
          style={{
            gap: spacing(2),
            marginTop: spacing(1.25),
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            onPress={() => toggleLike(item)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Ionicons
              name={
                item.like?.some(
                  (x: any) => x?.userId === user?._id || x?._id === user?._id
                )
                  ? 'heart'
                  : 'heart-outline'
              }
              size={20}
              color={
                item.like?.some(
                  (x: any) => x?.userId === user?._id || x?._id === user?._id
                )
                  ? '#ff5f91'
                  : '#ccc'
              }
            />
            <Text style={{ color: 'white', fontSize: 14 }}>
              {item.like?.length ?? 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setExpanded((e) => ({ ...e, [item._id]: !e[item._id] }))
            }
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#ccc" />
            <Text style={{ color: 'white', fontSize: 14 }}>
              {item.comment?.length ?? 0}
            </Text>
          </TouchableOpacity>
        </Row>

        {isOpen && (
          <View style={{ marginTop: spacing(1.5) }}>
            <Input
              placeholder="แสดงความคิดเห็น..."
              value={commentDraft[item._id] || ''}
              onChangeText={(t) =>
                setCommentDraft((d) => ({ ...d, [item._id]: t }))
              }
            />
            <View style={{ height: spacing(1) }} />
            <Button
              title="ส่ง"
              icon={<Ionicons name="send-outline" size={18} color="white" />}
              onPress={() => onSubmitComment(item._id)}
            />

            {(item.comment || []).map((c) => (
              <View
                key={c._id}
                style={{
                  marginTop: spacing(1),
                  backgroundColor: '#19223C',
                  borderRadius: 10,
                  padding: spacing(1.25),
                }}
              >
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    {c.createdBy?.email.split('@')[0]}{' '}
                    <Text style={{ color: palette.sub }}>
                      {timeAgo(c.createdAt)}
                    </Text>
                  </Text>
                  {c.createdBy?.email === user?.email && (
                    <TouchableOpacity
                      onPress={() => onDeleteComment(c._id, item._id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#ff6961" />
                    </TouchableOpacity>
                  )}
                </Row>
                <Text style={{ color: 'white', marginTop: 4 }}>{c.content}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    );
  };

  return (
    <Screen>
      <Header title="ฟีดสถานะ" back />
      <Card
        style={{
          marginBottom: spacing(1.5),
          backgroundColor: '#0F162E',
          borderRadius: 16,
          padding: spacing(2),
        }}
      >
        <Input
          value={newStatus}
          onChangeText={setNewStatus}
          placeholder="คุณกำลังคิดอะไรอยู่..."
          multiline
        />
        <View style={{ height: spacing(1) }} />
        <Button
          title="โพสต์"
          icon={<Ionicons name="megaphone-outline" size={18} color="white" />}
          onPress={onCreate}
          loading={posting}
        />
      </Card>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#fff" />
          <Text style={{ color: palette.sub, marginTop: 8 }}>กำลังโหลด...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={statuses}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </Screen>
  );
}
