import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const token = localStorage.getItem('accessToken');

  return token ? <Navigate to="/" replace /> : <>{children}</>;
}
