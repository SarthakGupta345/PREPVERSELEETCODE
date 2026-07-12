import { prisma } from "../../config/prisma";

export const problemSelect = {
    id: true,
    title: true,
    slug: true,
    difficulty: true,
    acceptanceRate: true,
    link: true,
    companyProblems: {
        select: {
            frequency: true,
            period: true,
            company: {
                select: {
                    name: true,
                    slug: true,
                },
            },
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
    let company = await prisma.company.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
        },
    });
    if (company) return company;

    company = await prisma.company.findUnique({
        where: { slug: id.toLowerCase() },
        select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
        },
    });
    if (company) return company;

    return prisma.company.findUnique({
        where: { name: id },
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