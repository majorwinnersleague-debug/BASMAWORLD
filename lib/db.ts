import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

// Neon is an operational enhancement. If it is unavailable, the existing
// Stripe/Airtable flow must continue to work rather than fail checkout.
export const sql = databaseUrl ? neon(databaseUrl) : null;
