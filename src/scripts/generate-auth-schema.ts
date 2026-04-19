import { execSync } from "child_process";

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn("BETTER_AUTH_SECRET not set, auth schema generation may fail");
}

if (!process.env.POSTGRES_URL) {
  console.warn("POSTGRES_URL not set, auth schema generation may fail");
}

console.log("Generating Better Auth schema...");

try {
  execSync(
    "bunx @better-auth/cli generate --config lib/auth.ts --output lib/db/auth-schema.ts -y",
    {
      stdio: "inherit",
      env: process.env,
      cwd: process.cwd(),
      shell: "/bin/bash",
    },
  );

  console.log("Better Auth schema generated successfully");
  process.exit(0);
} catch (error) {
  console.error("Auth schema generation error:", error);
  if (process.env.CI === "true") {
    process.exit(1);
  }
  console.warn("Continuing with existing auth schema (if available)");
  process.exit(0);
}
