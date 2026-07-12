import api from "@/config/axios";

export interface CompanyProblemParams {
    page?: number;
    limit?: number;
    difficulty?: "ALL" | "EASY" | "MEDIUM" | "HARD";
    sortBy?: "frequency" | "acceptanceRate" | "difficulty";
    order?: "asc" | "desc";
    period?: "30_days" | "3_months" | "6_months" | "all";
}

export const getCompanyProblemsApi = async (
    companyId: string,
    {
        page = 1,
        limit = 50,
        difficulty = "ALL",
        sortBy = "frequency",
        order = "desc",
        period = "all",
    }: CompanyProblemParams = {}
) => {
    try {
        const response = await api.get(
            `/companies/${companyId}/problems`,
            {
                params: {
                    page,
                    limit,
                    difficulty,
                    sortBy,
                    order,
                    period,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};

export const getSolvedCompanyProblemsApi = async (
    companyId: string,
    {
        page = 1,
        limit = 50,
        difficulty = "ALL",
        sortBy = "frequency",
        order = "desc",
        period = "all",
    }: CompanyProblemParams = {}
) => {
    try {
        const response = await api.get(
            `/companies/${companyId}/problems/solved`,
            {
                params: {
                    page,
                    limit,
                    difficulty,
                    sortBy,
                    order,
                    period,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};


export const getUnsolvedCompanyProblemsApi = async (
    companyId: string,
    {
        page = 1,
        limit = 50,
        difficulty = "ALL",
        sortBy = "frequency",
        order = "desc",
        period = "all",
    }: CompanyProblemParams = {}
) => {
    try {
        const response = await api.get(
            `/companies/${companyId}/problems/unsolved`,
            {
                params: {
                    page,
                    limit,
                    difficulty,
                    sortBy,
                    order,
                    period,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};

export const getAllCompaniesApi = async () => {
    try {
        const response = await api.get("/companies");

        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};

export const getCompanyApi = async (
    companyId: string
) => {
    try {
        const response = await api.get(
            `/companies/${companyId}`
        );

        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};