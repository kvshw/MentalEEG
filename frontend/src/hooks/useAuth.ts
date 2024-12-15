import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          try {
            await authApi.verifyToken(storedToken);
            setToken(storedToken);
          } catch (error) {
            console.error('Token verification failed:', error);
            // Token is invalid, clear auth state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            deleteCookie('isAuthenticated');
            router.push('/login');
          }
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [router]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setToken(data.access);
      setCookie('isAuthenticated', 'true', {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials. Please try again.');
      }
      throw new Error('An error occurred while signing in. Please try again.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setToken(data.access);
      setCookie('isAuthenticated', 'true', {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.push('/dashboard');
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    enabled: !!token && isInitialized,
    retry: false,
    onError: (error: any) => {
      if (error.response?.status === 401) {
        logout();
      }
    },
  });

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      deleteCookie('isAuthenticated');
      router.push('/login');
    }
  };

  return {
    token,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    profile,
    isLoadingProfile,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isAuthenticated: !!token && isInitialized,
  };
}; 