import { Outlet } from 'react-router-dom';
import { AuthLayout } from '@/components/auth-layout';

export const AuthRoute = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export const ProtectedAuthRoute = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};
