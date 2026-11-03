import { treaty } from "@elysiajs/eden";
import type { App } from "thfat-edu-be";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Typesafe Elysia API client via Eden Treaty.
 * Provides autocomplete and compile-time validation for all backend routes and payloads.
 */
export const api = treaty<App>(API_BASE_URL);
