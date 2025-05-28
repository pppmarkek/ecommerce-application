import { Header } from '@/components/Header/Header';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('accessToken');

  return token ? (
    <>
      <Header />
      {children}
    </>
  ) : (
    <NotFoundPage />
  );
}
