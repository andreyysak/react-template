import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, type RenderHookOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, MemoryRouter, type RouteObject, RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { theme } from '@/shared/config/theme';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

interface ProvidersProps {
  children: ReactNode;
  queryClient: QueryClient;
}

const Providers = ({ children, queryClient }: ProvidersProps) => (
  <MantineProvider theme={theme} env="test">
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  </MantineProvider>
);

interface RenderOptions {
  /** Початковий URL */
  route?: string;
  /** Додаткові маршрути; `ui` рендериться для всіх інших шляхів */
  routes?: RouteObject[];
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', routes = [], queryClient = createTestQueryClient() }: RenderOptions = {},
) => {
  const router = createMemoryRouter([...routes, { path: '*', element: ui }], {
    initialEntries: [route],
  });

  return {
    user: userEvent.setup(),
    router,
    queryClient,
    ...render(
      <Providers queryClient={queryClient}>
        <RouterProvider router={router} />
      </Providers>,
    ),
  };
};

export const renderHookWithProviders = <Result, Props>(
  hook: (props: Props) => Result,
  {
    route = '/',
    queryClient = createTestQueryClient(),
    ...options
  }: Omit<RenderHookOptions<Props>, 'wrapper'> & Omit<RenderOptions, 'routes'> = {},
) => ({
  queryClient,
  ...renderHook(hook, {
    ...options,
    wrapper: ({ children }) => (
      <Providers queryClient={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Providers>
    ),
  }),
});

export * from '@testing-library/react';
