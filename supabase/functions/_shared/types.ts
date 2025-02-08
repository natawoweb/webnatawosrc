
export interface CreateUserPayload {
  email: string;
  fullName: string;
  role: 'reader' | 'writer' | 'manager' | 'admin';
  password: string;
  level: string;
}

export interface SupabaseConfig {
  url: string;
  key: string;
}
