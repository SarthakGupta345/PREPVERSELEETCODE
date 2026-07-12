import z from "zod";

export const problemQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce
        .number()
        .min(1)
        .max(100)
        .default(50),

    difficulty: z
        .enum(["EASY", "MEDIUM", "HARD", "ALL"])
        .default("ALL"),

    sortBy: z
        .enum(["frequency", "acceptanceRate"])
        .default("frequency"),

    order: z
        .enum(["asc", "desc"])
        .default("desc"),
});

