// src/api/auth.ts
import { api } from './client';

export type LoginPayload = { email: string; password: string };

// ให้ LoginResponse ที่เราใช้ใน AuthProvider = { data, token }
export type LoginResponse = {
  data: any;     // โครงสร้าง user จาก API
  token: string; // JWT ใน data.token
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  // ตอบกลับจริง: { data: { ...user, token: "..." } }
  const res = await api.post('/signin', payload);
  const body = res.data;

  // ดึง token จากตำแหน่งที่ API ให้มา
  const token =
    body?.token ||            // เผื่ออนาคตย้ายออกมา top-level
    body?.data?.token ||      // *** ตำแหน่งปัจจุบัน ***
    body?.access_token ||     // เผื่อใช้ชื่ออื่น
    '';

  if (!token) {
    // ส่งกลับแบบที่ AuthProvider จะโชว์ error ต่อได้
    throw new Error('ไม่พบ token จากระบบ');
  }

  // user info = body.data (ยก whole object กลับไป)
  return {
    data: body.data,
    token,
  };
}
