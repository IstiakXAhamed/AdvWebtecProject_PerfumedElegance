'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Forgot password steps: 1 = Enter Email, 2 = Verify Question & Reset
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 1: Submit email to retrieve their security question
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.get(`/auth/forgot-password/question/${email.trim()}`);
      setSecurityQuestion(res.data.question);
      setStep(2); // Progress to security answer step
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Email address not registered in our catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit security answer and reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!answer.trim()) {
      setErrorMsg('Please answer your security question.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: email.trim(),
        answer: answer.trim(),
        newPassword,
      };

      await api.post('/auth/forgot-password/reset', payload);
      setSuccessMsg('Your password has been reset successfully! Redirecting to login...');
      
      // Auto redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Verification failed. Incorrect answer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-16">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 rounded-none">
        <div className="card-body p-8">
          
          <h2 className="text-2xl font-light tracking-widest text-center uppercase mb-6 border-b border-base-300 pb-3">
            Account Recovery
          </h2>

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-error/15 border border-error text-error text-xs uppercase tracking-wider font-semibold p-4 rounded-none mb-6 text-center">
              {errorMsg}
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-success/15 border border-success text-success text-xs uppercase tracking-wider font-semibold p-4 rounded-none mb-6 text-center">
              {successMsg}
            </div>
          )}

          {/* STEP 1: Enter Email Form */}
          {step === 1 && !successMsg && (
            <form onSubmit={handleVerifyEmail} className="space-y-5">
              <p className="text-xs text-base-content/60 leading-relaxed tracking-wide">
                Please enter your registered email address below. We will retrieve your security challenge question to verify your account identity.
              </p>
              
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="sanim@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-primary text-sm tracking-wide h-12"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-neutral rounded-none w-full tracking-wider uppercase font-medium h-12 mt-2"
              >
                {isLoading ? 'Searching Registry...' : 'Retrieve Security Challenge'}
              </button>
            </form>
          )}

          {/* STEP 2: Answer Challenge & Reset Form */}
          {step === 2 && !successMsg && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="bg-base-200 border border-base-300 p-4 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-base-content/50 block mb-1">
                  Identity Challenge
                </span>
                <span className="text-xs font-semibold tracking-wide text-neutral uppercase">
                  {securityQuestion}
                </span>
              </div>

              {/* Security Answer */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Your Answer
                </label>
                <input
                  type="text"
                  placeholder="Type your security answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-primary text-sm tracking-wide h-12"
                  required
                />
              </div>

              {/* New Password */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-primary text-sm tracking-wide h-12"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-primary text-sm tracking-wide h-12"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-neutral rounded-none w-full tracking-wider uppercase font-medium h-12 mt-2"
              >
                {isLoading ? 'Resetting Password...' : 'Reset My Password'}
              </button>
            </form>
          )}

          <div className="text-center mt-6 text-xs tracking-wider">
            <Link href="/auth/login" className="link link-neutral font-semibold uppercase">
              ← Return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
