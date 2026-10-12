import { createBrowserRouter } from 'react-router';
import { GuestOnly, RequireAuth } from '@/features/auth';
import { ErrorPage } from '@/pages/error/ErrorPage';
import { ROUTES } from '@/shared/config/routes';
import { RootLayout } from '../layouts/RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: ROUTES.home,
            lazy: async () => ({
              Component: (await import('@/pages/home/HomePage')).HomePage,
            }),
          },
        ],
      },
      {
        element: <GuestOnly />,
        children: [
          {
            path: ROUTES.login,
            lazy: async () => ({
              Component: (await import('@/pages/auth/login/LoginPage')).LoginPage,
            }),
          },
        ],
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('@/pages/not-found/NotFoundPage')).NotFoundPage,
        }),
      },
    ],
  },
]);
