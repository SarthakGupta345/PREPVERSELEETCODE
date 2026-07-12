import { useQuery } from "@tanstack/react-query";
import {
    getTopicsApi,
    getTopicProblemsApi,
} from "@/services/problemApi";

export const useTopics = () => {
    return useQuery({
        queryKey: ["topics"],
        queryFn: getTopicsApi,
    });
};

export const useTopicProblems = (
    params: {
        topic: string;
        page?: number;
        limit?: number;
        difficulty?: "ALL" | "EASY" | "MEDIUM" | "HARD";
        sortBy?: "frequency" | "acceptanceRate";
        order?: "asc" | "desc";
    },
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: ["topicProblems", params],
        queryFn: () => getTopicProblemsApi(params),
        enabled: !!params?.topic && (options?.enabled ?? true),
    });
};
