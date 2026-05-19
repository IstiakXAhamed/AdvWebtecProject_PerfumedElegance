'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema, RegisterFormData } from '@/schemas/authSchemas';
import api from '@/lib/axios';
import { Input } from '@/components/Input';

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const cleanData = {
        ...data,
        email: data.email.trim().toLowerCase(),
      };
      await api.post('/auth/register', cleanData);
      router.push('/auth/login');
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError('email', {
          type: 'server',
          message: error.response.data.message,
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
            Create an Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="alert alert-error py-2 text-sm shadow-md">
                <span>{errors.root.message}</span>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Sanim Ahmed"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

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

            {/* Security Question Dropdown Selector */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                Security Question
              </label>
              <select
                className="select select-bordered rounded-none bg-base-100 border-base-300 text-sm focus:outline-none focus:border-primary h-12"
                {...register('securityQuestion')}
              >
                <option value="What was your first pet's name?">What was your first pet's name?</option>
                <option value="What city were you born in?">What city were you born in?</option>
                <option value="What is your favorite perfume ingredient?">What is your favorite perfume ingredient?</option>
                <option value="What was the name of your first school?">What was the name of your first school?</option>
              </select>
              {errors.securityQuestion && (
                <span className="text-xs text-error mt-1">{errors.securityQuestion.message}</span>
              )}
            </div>

            {/* Security Answer Input */}
            <Input
              label="Security Answer"
              type="text"
              placeholder="e.g. Max"
              error={errors.securityAnswer?.message}
              {...register('securityAnswer')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-2"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <span>Already have an account? </span>
            <Link href="/auth/login" className="link link-primary font-semibold">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
