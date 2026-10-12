import { http } from '@/shared/services/http';
import type { LoginDto, LoginResponse, User } from '../types';

export const authService = {
  login: (dto: LoginDto) =>
    http.post<LoginResponse>('/auth/login', dto).then((response) => response.data),
  me: () => http.get<User>('/me').then((response) => response.data),
};
