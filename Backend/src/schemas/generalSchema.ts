import z from "zod"

export const idSchema = z.object({
    id: z.string(),
})

export const usernameSchema = z.object({
    username: z.string(),
})

export const topicSchema = z.object({
    topic: z.string(),
})

export const companySchema = z.object({
    company: z.string(),
})