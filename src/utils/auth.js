// utils/auth.js
import { useDispatch } from 'react-redux';
import { clearUser } from '@/redux/slice/userSlice';
import { useRouter } from 'next/navigation';

// Custom hook for logout functionality
export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = () => {
    // Clear Redux state and localStorage
    dispatch(clearUser());
    
    // Redirect to login
    router.push('/login');
  };

  return logout;
};

// Utility to check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
  return false;
};

// Utility to get stored token
export const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Utility to get stored user
export const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }
  return null;
};