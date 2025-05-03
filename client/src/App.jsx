// App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './Layout/ProtectedRoute';
import Register from './pages/Register';
import EmailVerificationPage from './pages/verification';
import ForgotPasswordPage from './pages/forgotPassword';
import ChangePassword from './pages/ChangePassword';


function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />,
    },
     {
      path: "/verify-email",
      element: <EmailVerificationPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password/:token",
      element: <ChangePassword />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/project",
          element: <Layout />,
          children: [
            {
              path: ":projectId/home",
              element: <Home />
            },
            {
              index: true,
              element: <div>Select a project</div>
            }
          ]
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;