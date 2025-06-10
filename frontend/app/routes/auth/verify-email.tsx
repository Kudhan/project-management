import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useVerifyEmailMutation } from '@/hooks/use-auth';

const Loader = () => (
  <svg className="w-10 h-10 text-gray-500 animate-spin" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const { mutate, isPending } = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get('token');

    console.log("[VerifyEmail] Token from URL:", token);

    if (!token) {
      console.warn("[VerifyEmail] No token found in URL.");
      setIsSuccess(false);
      return;
    }

    console.log("[VerifyEmail] Attempting to verify email with token...");

    mutate(
      { token },
      {
        onSuccess: (data) => {
          console.log("[VerifyEmail] Email verification successful:", data);
          setIsSuccess(true);
        },
        onError: (error: any) => {
          console.error("[VerifyEmail] Email verification failed:", error);
          if (error?.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
          }
          setIsSuccess(false);
        },
      }
    );
  }, [searchParams, mutate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      <p className="text-sm text-gray-500 mb-4">Verifying your email...</p>
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link to="/sign-in" className="flex items-center gap-2 text-sm text-blue-500">
            <ArrowLeft className="w-4 h-4" />
            Back To Sign In
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {isPending ? (
              <>
                <Loader />
                <h3 className="text-lg font-semibold mt-4">Verifying Email...</h3>
                <p className="text-sm text-gray-500">Please wait while we verify your email.</p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h3 className="text-lg font-semibold mt-4">Email Verified</h3>
                <p className="text-sm text-gray-500">Your email has been verified successfully.</p>
                <Link to="/sign-in">
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Back to Sign In
                  </button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-500" />
                <h3 className="text-lg font-semibold mt-4">Email Verification Failed</h3>
                <p className="text-sm text-gray-500">Verification failed. Please try again.</p>
                <Link to="/sign-up" className="mt-4 text-sm text-blue-500 underline">
                  Back To Sign Up
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
