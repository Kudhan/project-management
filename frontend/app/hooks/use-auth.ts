import { postData } from '@/lib/fetch-util';
import type { SignUpFormData } from '@/routes/auth/sign-up';
import { useMutation } from '@tanstack/react-query';

// Define payload type for backend (exclude confirmPassword)
type SignUpPayload = Omit<SignUpFormData, 'confirmPassword'>;

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpPayload) => postData("/auth/sign-up", data),
  });
};
