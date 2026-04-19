/**
 * Database Schema
 *
 * Add your application tables here.
 * Better Auth tables are re-exported from auth-schema.ts.
 */

// Re-export Better Auth schema tables
export {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
} from "./auth-schema";
