import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { useAuthStore } from '../store/auth.store';

export const GuestOnly = () => {
  const token = useAuthStore((state) => state.token);

  if (token) return <Navigate to={ROUTES.home} replace />;

  return <Outlet />;
};
