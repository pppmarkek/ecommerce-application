import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('accessToken');

  return token ? <>{children}</> : <NotFoundPage />;
}
