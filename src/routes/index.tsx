import { createBrowserRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Profile from '@/pages/profile/Profile'
import EditProfile from '@/pages/profile/EditProfile'
import CreatePost from '@/pages/posts/CreatePost'
import PostDetail from '@/pages/posts/PostDetail'
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
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/profile/edit',
    element: <EditProfile />,
  },
  {
    path: '/posts/new',
    element: <CreatePost />,
  },
  {
    path: '/posts/:postId',
    element: <PostDetail />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
