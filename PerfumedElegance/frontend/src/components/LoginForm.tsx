'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, LoginFormData } from '@/schemas/authSchemas';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/axios';
import { Input } from '@/components/Input';

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // 1. Post credentials to NestJS backend
      const response = await api.post('/auth/login', data);
      const { access_token } = response.data;

      // 2. Decode the JWT payload to read user details
      const base64Payload = access_token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));

      // 3. Save to global Zustand store (which also saves to localStorage)
      setAuth(
        {
          id: decodedPayload.sub,
          email: decodedPayload.email,
          role: decodedPayload.role,
        },
        access_token
      );

      // 4. Redirect the user based on their security role
      if (decodedPayload.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      // 5. Handle login failures (like wrong password)
      if (error.response?.status === 401) {
        setError('root', {
          type: 'server',
          message: 'Invalid email or password. Please try again.',
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* General Login Error Alert */}
            {errors.root && (
              <div className="alert alert-error py-2 text-sm shadow-md">
                <span>{errors.root.message}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-2"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <span>Don't have an account? </span>
            <Link href="/auth/register" className="link link-primary font-semibold">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
