import { Center, Loader, MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import { theme } from '@/shared/config/theme';
import { queryClient } from '@/shared/services/queryClient';

const FullScreenLoader = () => (
  <Center h="100vh">
    <Loader />
  </Center>
);

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <MantineProvider theme={theme} defaultColorScheme="auto">
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<FullScreenLoader />}>{children}</Suspense>
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </MantineProvider>
);
