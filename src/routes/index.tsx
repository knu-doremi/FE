import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import NotFound from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
