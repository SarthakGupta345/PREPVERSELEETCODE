

import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { PrismaClient } from "../generated/prisma/client";

export default defineConfig({
  schema: "./prisma/schema.prisma",

  migrations: {
    path: "./prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});


