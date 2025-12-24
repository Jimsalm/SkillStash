import { api } from "@/lib/axios";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  msg: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiError {
  response?: {
    data?: {
      msg: string;
      error?: string;
    };
  };
}

export const login = async (credentials: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const { confirmPassword, ...payload } = data;
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};