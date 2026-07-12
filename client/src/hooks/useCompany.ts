import { useQuery } from "@tanstack/react-query";
import {
    getAllCompaniesApi,
    getCompanyApi,
    getCompanyProblemsApi,
    getSolvedCompanyProblemsApi,
    getUnsolvedCompanyProblemsApi,
    CompanyProblemParams,
} from "@/services/companyApi";

export const useAllCompanies = () => {
    return useQuery({
        queryKey: ["companies"],
        queryFn: getAllCompaniesApi,
    });
};

export const useCompany = (companyId: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["company", companyId],
        queryFn: () => getCompanyApi(companyId),
        enabled: !!companyId && (options?.enabled ?? true),
    });
};

export const useCompanyProblems = (
    companyId: string,
    params?: CompanyProblemParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ["companyProblems", companyId, params],
        queryFn: () => getCompanyProblemsApi(companyId, params),
        enabled: !!companyId && (options?.enabled ?? true),
    });
};

export const useSolvedCompanyProblems = (
    companyId: string,
    params?: CompanyProblemParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ["companySolvedProblems", companyId, params],
        queryFn: () => getSolvedCompanyProblemsApi(companyId, params),
        enabled: !!companyId && (options?.enabled ?? true),
    });
};

export const useUnsolvedCompanyProblems = (
    companyId: string,
    params?: CompanyProblemParams,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ["companyUnsolvedProblems", companyId, params],
        queryFn: () => getUnsolvedCompanyProblemsApi(companyId, params),
        enabled: !!companyId && (options?.enabled ?? true),
    });
};
