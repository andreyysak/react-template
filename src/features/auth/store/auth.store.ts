import { create } from 'zustand';
import { queryClient } from '@/shared/services/queryClient';
import { setUnauthorizedHandler } from '@/shared/services/http';
import { tokenStorage } from '@/shared/utils/tokenStorage';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: tokenStorage.get(),
  setToken: (token) => {
    tokenStorage.set(token);
    set({ token });
  },
  clearToken: () => {
    tokenStorage.clear();
    set({ token: null });
  },
}));

setUnauthorizedHandler(() => {
  useAuthStore.getState().clearToken();
  queryClient.clear();
});
