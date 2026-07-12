// hooks/useAuth.ts

import { loginApi, LoginParams, otpVerifyApi, OtpVerifyParams, signupApi, SignupParams, getMeApi } from "@/services/authApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginParams) => loginApi(data),
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: (data: SignupParams) => signupApi(data),
    });
};

export const useOtpVerify = () => {
    return useMutation({
        mutationFn: (data: OtpVerifyParams) =>
            otpVerifyApi(data),
    });
};

export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMeApi,
        retry: false,
    });
};