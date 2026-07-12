import { prisma } from "../../config/prisma";

export const problemSelect = {
    id: true,
    title: true,
    slug: true,
    difficulty: true,
    frequency: true,
    acceptanceRate: true,
    link: true,
    companies: {
        select: {
            name: true,
            slug: true,
        },
    },
    topics: {
        select: {
            name: true,
            slug: true,
        },
    },
} as const;

export const getCompany = async (id: string) => {
    return prisma.company.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
        },
    });
};

export const buildOrderBy = (
    sortBy: "frequency" | "difficulty" | "acceptanceRate",
    order: "asc" | "desc"
) => {
    switch (sortBy) {
        case "difficulty":
            return { difficulty: order };

        case "acceptanceRate":
            return { acceptanceRate: order };

        default:
            return { frequency: order };
    }
};