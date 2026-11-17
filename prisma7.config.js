import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Comando per eseguire lo script di seed: npx prisma db seed
    seed: "prisma/seed.js",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
