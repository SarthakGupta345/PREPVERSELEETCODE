import api from "@/config/axios"

export interface LoginParams {
    email: string;
    password: string;
}

export interface SignupParams {
    username: string;
    email: string;
    password: string;
}

export interface OtpVerifyParams {
    email: string;
    otp: string;
}

export interface GoogleLoginParams {
    token: string;
}

export const loginApi = async ({ email, password }: LoginParams) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};

export const signupApi = async ({ username, email, password }: SignupParams) => {
    try {
        const response = await api.post("/auth/signup", { username, email, password });
        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};

export const otpVerifyApi = async ({ email, otp }: OtpVerifyParams) => {
    try {
        const response = await api.post("/auth/otp-verify", { email, otp });
        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};