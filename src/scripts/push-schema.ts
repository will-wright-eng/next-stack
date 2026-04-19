import { execSync } from "child_process";

if (!process.env.POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set");
  process.exit(1);
}

console.log("Generating Better Auth schema...");
try {
  execSync("bun run auth:generate", {
    stdio: "inherit",
    env: process.env,
    cwd: process.cwd(),
  });
} catch (error) {
  console.warn("Auth schema generation failed, continuing with existing schema");
}

console.log("Pushing database schema (non-interactive)...");

try {
  execSync("yes | bunx drizzle-kit push --force", {
    stdio: "inherit",
    env: process.env,
    cwd: process.cwd(),
    shell: "/bin/bash",
  });
  console.log("Database schema synchronized successfully");
  process.exit(0);
} catch (error) {
  console.error("Schema push failed:", error);
  process.exit(1);
}
