import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';

const ProtectedRoute: FC = () => {
  const { user } = useAppContext();

  if (!user) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
