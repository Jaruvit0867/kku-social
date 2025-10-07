// src/api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ----- ปรับ baseURL ให้ตรงกับเซิร์ฟเวอร์ -----
export const api = axios.create({
  baseURL: 'https://cis.kku.ac.th/api/classroom',
  headers: { 'Content-Type': 'application/json' },
});

// ใช้เรียกจาก AuthProvider เพื่อใส่/ลบ Authorization
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// ----- Request Interceptor: ใส่ api-key + token ทุกครั้ง -----
api.interceptors.request.use(async (config) => {
  config.headers = config.headers ?? {};

  // ใส่ API Key (เหมือนที่คุณเทสใน Postman)
  config.headers['x-api-key'] =
    '060b14bcb39e34f64d0bb3a04998c9998ae051d50411420de4ecff37ff36c477';

  // เผื่อกรณีรีโหลดแอพแล้วยังไม่มีใน defaults
  if (!config.headers.Authorization) {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  // debug log
  console.log('>>> REQUEST', config.method?.toUpperCase(), config.url, config.data ?? {});
  return config;
});

// ----- Response Interceptor: log error ชัด ๆ -----
api.interceptors.response.use(
  (res) => {
    console.log('<<< RESPONSE', res.status, res.config.url, res.data);
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url;
    const data = err?.response?.data;
    console.log('xxx ERROR', status, url, data);
    return Promise.reject(err);
  }
);
