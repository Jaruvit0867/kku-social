import { api } from './client';

export type Member = {
  _id: string;
  firstname: string;
  lastname: string;
  email?: string;
  image?: string;
  role?: string;
  type?: string;
  education?: {
    studentId?: string;
    major?: string;
    enrollmentYear?: string;
    schoolId?: string | null;
  };
};

export type ClassByYearResponse = {
  data: Member[];   // ปรับตามสคีมจริงได้ภายหลัง
  total?: number;
};

export async function getMembersByYear(year: number | string) {
  // baseURL ของเรา = https://cis.kku.ac.th/api/classroom
  // จากตัวอย่าง: GET /classroom/class/2565  => path ที่นี่คือ /class/2565
  const { data } = await api.get<ClassByYearResponse>(`/class/${year}`);
  return data?.data ?? (data as any); // กันกรณีตอบเป็น array ตรง ๆ
}
