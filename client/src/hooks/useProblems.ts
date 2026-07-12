import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProblemApi,
    markProblemDoneApi,
    markProblemUndoneApi,
    getTopicsApi,
} from "@/services/problemApi";

export const useProblems = (params?: any) => {
    return useQuery({
        queryKey: ["problems", params],
        queryFn: () => getProblemApi(params),
    });
};

export const useTopics = () => {
    return useQuery({
        queryKey: ["topics"],
        queryFn: getTopicsApi,
    });
};

export const useMarkProblemDone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (problemId: string) => markProblemDoneApi(problemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            queryClient.invalidateQueries({ queryKey: ["companyProblems"] });
            queryClient.invalidateQueries({ queryKey: ["companySolvedProblems"] });
            queryClient.invalidateQueries({ queryKey: ["companyUnsolvedProblems"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
};

export const useMarkProblemUndone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (problemId: string) => markProblemUndoneApi(problemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            queryClient.invalidateQueries({ queryKey: ["companyProblems"] });
            queryClient.invalidateQueries({ queryKey: ["companySolvedProblems"] });
            queryClient.invalidateQueries({ queryKey: ["companyUnsolvedProblems"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
};
