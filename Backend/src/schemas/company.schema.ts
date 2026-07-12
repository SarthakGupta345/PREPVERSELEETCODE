import z from "zod";

export const companyIdSchema = z.object({
    id: z.string().min(1, "Company ID is required"),
});

export const companyProblemQuerySchema = z.object({
    difficulty: z
        .enum(["EASY", "MEDIUM", "HARD", "ALL"])
        .default("ALL"),

    sortBy: z
        .enum(["frequency", "difficulty", "acceptanceRate"])
        .default("frequency"),

    order: z
        .enum(["asc", "desc"])
        .default("desc"),

    period: z
        .enum(["30_days", "3_months", "6_months", "all"])
        .default("all"),
});
