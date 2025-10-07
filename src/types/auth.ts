export type UserProfile = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  image?: string;
  role?: string;         // "student" ฯลฯ
  type?: string;         // "undergraduate" ฯลฯ
  confirmed?: boolean;
  education?: {
    major?: string;
    enrollmentYear?: string;
    studentId?: string;
    schoolId?: string;
  };
  job?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};
