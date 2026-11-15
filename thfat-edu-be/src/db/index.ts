import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../config/env";
import * as schema from "./schema";

const isServerless = Boolean(process.env.VERCEL);

/**
 * PostgreSQL connection client with serverless-friendly pooling:
 *
 * - On Vercel Serverless: max 1 connection per lambda instance
 * - On local/standalone server: max 10 connections pool
 */
export const queryClient = postgres(env.DATABASE_URL, {
  max: isServerless ? 1 : 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
export { schema };
