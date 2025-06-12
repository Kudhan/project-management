import { postData } from '@/lib/fetch-util';
import type { SignUpFormData } from '@/routes/auth/sign-up';
import { useMutation } from '@tanstack/react-query';

type SignUpPayload = Omit<SignUpFormData, 'confirmPassword'>;

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpPayload) => postData("/auth/sign-up", data),
  });
};


export const useVerifyEmailMutation=()=>{
  return useMutation({
    mutationFn:(data:{token:string})=> postData("/auth/verify-email",data),
  });
};

export const useLoginMutation = ()=>{
  return useMutation({
    mutationFn:(data:{email:string;password:string})=>postData("/auth/sign-in",data),
  });
};