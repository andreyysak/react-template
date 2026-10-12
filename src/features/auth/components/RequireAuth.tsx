import { Center, Loader } from '@mantine/core';
import { Navigate, Outlet, useLocation } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { useMe } from '../queries/auth.queries';
import { useAuthStore } from '../store/auth.store';

export const RequireAuth = () => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  const { isPending, error } = useMe();

  if (!token || error?.status === 401) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (error) throw error;

  if (isPending) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return <Outlet />;
};
