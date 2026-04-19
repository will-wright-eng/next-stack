/**
 * Database Client
 *
 * Uses @neondatabase/serverless for Vercel (VERCEL=1)
 * Uses postgres-js for local development
 */

import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error(
    "POSTGRES_URL environment variable is required. " +
      "Ensure Neon database is connected or the variable is set in .env.local",
  );
}

const useVercel = process.env.VERCEL === "1";

let db: any;
let sql: any;

if (useVercel) {
  const { neon } = require("@neondatabase/serverless");
  const { drizzle: drizzleNeon } = require("drizzle-orm/neon-http");

  sql = neon(process.env.POSTGRES_URL);
  db = drizzleNeon(sql, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });
} else {
  const postgres = require("postgres");
  const { drizzle: drizzlePostgres } = require("drizzle-orm/postgres-js");

  sql = postgres(process.env.POSTGRES_URL, {
    max: 1,
  });

  db = drizzlePostgres(sql, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });
}

export { db };
export { sql };
export type Database = typeof db;
