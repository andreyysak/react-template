import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/shared/types/api';
import type { User } from '../types';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { authKeys } from './keys';

export const useMe = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<User, ApiError>({
    queryKey: authKeys.me(),
    queryFn: authService.me,
    enabled: !!token,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ accessToken, user }) => {
      setToken(accessToken);
      queryClient.setQueryData(authKeys.me(), user);
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearToken = useAuthStore((state) => state.clearToken);

  return () => {
    clearToken();
    queryClient.clear();
  };
};
