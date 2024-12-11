import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, LoginCredentials, RegisterData } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie } from 'cookies-next';

export const useAuth = () => {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      // Set authentication cookie
      setCookie('isAuthenticated', 'true', {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        return new Error('Invalid credentials. Please try again.');
      }
      return new Error('An error occurred while signing in. Please try again.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setCookie('isAuthenticated', 'true', {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.push('/dashboard');
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      return authApi.getProfile(token);
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    deleteCookie('isAuthenticated');
    router.push('/login');
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    profile,
    isLoadingProfile,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}; 