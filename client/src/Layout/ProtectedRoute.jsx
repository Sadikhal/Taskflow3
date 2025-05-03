import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const ProtectedRoute = () => {
  const { isAuthenticated, checkAuth } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) navigate('/login');
    };

    if (!isAuthenticated) verifyAuth();
  }, [isAuthenticated, checkAuth, navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;