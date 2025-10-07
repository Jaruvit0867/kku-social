// src/api/status.ts
import { api } from './client';

// ===== Types (ตามสกีมของ API จริง) =====
export type MiniUser = { _id: string; email?: string };
export type Comment = {
  _id: string;
  content: string;
  createdBy: MiniUser;
  createdAt: string;
};
export type Post = {
  _id: string;
  content: string;
  createdBy: MiniUser;
  like: any[];        // โครงสร้าง like ไม่ได้ระบุชัด ใช้ any ไปก่อน
  comment: Comment[];
  createdAt: string;
  updatedAt: string;
};

// ===== API =====
export async function getStatuses(): Promise<Post[]> {
  const { data } = await api.get('/status');
  // API ตอบ { data: [...] }
  return data?.data ?? [];
}

export async function createStatus(content: string) {
  const { data } = await api.post('/status', { content });
  return data;
}

export async function likeStatus(statusId: string) {
  // ต้องส่ง { statusId }
  const { data } = await api.post('/like', { statusId });
  return data;
}

export async function unlikeStatus(statusId: string) {
  // DELETE ต้องส่ง body ผ่าน { data: ... }
  const { data } = await api.delete('/like', { data: { statusId } });
  return data;
}

export async function addComment(statusId: string, content: string) {
  // *** จุดแก้หลัก: ต้องเป็น statusId ไม่ใช่ status ***
  // ส่ง { content, statusId }
  const payload = { content, statusId };
  console.log('>>> POST /comment', payload);
  const { data } = await api.post('/comment', payload);
  console.log('<<< /comment', data);
  return data;
}

export async function deleteComment(commentId: string, statusId: string) {
  // ต้องส่ง { statusId } ใน body
  const { data } = await api.delete(`/comment/${commentId}`, {
    data: { statusId },
  });
  return data;
}

export async function deleteStatus(postId: string) {
  const { data } = await api.delete(`/status/${postId}`);
  return data;
}
