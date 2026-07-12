import api from "@/config/axios";

interface GetProblemsParams {
    page?: number;
    limit?: number;
    difficulty?: "ALL" | "EASY" | "MEDIUM" | "HARD";
    sortBy?: "frequency" | "acceptanceRate";
    order?: "asc" | "desc";
}

export const getProblemApi = async ({
    page = 1,
    limit = 50,
    difficulty = "ALL",
    sortBy = "frequency",
    order = "desc",
}: GetProblemsParams = {}) => {
    try {
        const response = await api.get("/problems", {
            params: {
                page,
                limit,
                difficulty,
                sortBy,
                order,
            },
        });

        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};


interface GetTopicProblemsParams {
    topic: string;
    page?: number;
    limit?: number;
    difficulty?: "ALL" | "EASY" | "MEDIUM" | "HARD";
    sortBy?: "frequency" | "acceptanceRate";
    order?: "asc" | "desc";
}

export const getTopicProblemsApi = async ({
    topic,
    page = 1,
    limit = 50,
    difficulty = "ALL",
    sortBy = "frequency",
    order = "desc",
}: GetTopicProblemsParams) => {
    try {
        const response = await api.get(
            `/problems/topics/${topic}/problems`,
            {
                params: {
                    page,
                    limit,
                    difficulty,
                    sortBy,
                    order,
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

export const getTopicsApi = async () => {
    try {
        const response = await api.get("/problems/topics");

        return response.data;
    } catch (error: any) {
        return {
            error:
                error?.response?.data?.message ||
                "Something went wrong",
        };
    }
};


export const markProblemDoneApi = async (
    problemId: string
) => {
    try {
        const response = await api.post(
            `/problems/${problemId}/done`
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

export const markProblemUndoneApi = async (
    problemId: string
) => {
    try {
        const response = await api.delete(
            `/problems/${problemId}/done`
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