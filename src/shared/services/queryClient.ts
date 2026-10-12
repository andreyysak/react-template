import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from '@/shared/types/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => {
        const status = (error as Partial<ApiError>).status ?? 0;
        return failureCount < 1 && (status === 0 || status >= 500);
      },
      refetchOnWindowFocus: false,
    },
  },
});
