/**
 * Environment helpers
 *
 * Vercel-aware URL resolution for auth and API configuration.
 * Handles preview deployments automatically via VERCEL_URL / VERCEL_BRANCH_URL.
 */

export function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

/**
 * Server-side base URL.
 *
 * Priority: VERCEL_BRANCH_URL > VERCEL_URL > NEXT_PUBLIC_SITE_URL > localhost
 */
export function getBaseUrl(): string {
  if (process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }

  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://")) {
      return vercelUrl;
    }
    return `https://${vercelUrl}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return "http://localhost:3000";
}

/**
 * Client-side base URL.
 *
 * Priority: NEXT_PUBLIC_SITE_URL > window.location.origin
 */
export function getBaseUrlClient(): string {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return getBaseUrl();
}

/**
 * Server-side Better Auth URL.
 *
 * Priority: BETTER_AUTH_URL > BETTER_AUTH_BASE_URL > getBaseUrl()
 */
export function getBetterAuthUrl(): string {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.BETTER_AUTH_BASE_URL) {
    return process.env.BETTER_AUTH_BASE_URL;
  }
  return getBaseUrl();
}

/**
 * Client-side Better Auth URL.
 *
 * Priority: NEXT_PUBLIC_BETTER_AUTH_URL > getBaseUrlClient()
 */
export function getBetterAuthUrlClient(): string {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  return getBaseUrlClient();
}

/**
 * Trusted origins for Better Auth origin validation.
 *
 * Includes localhost, current Vercel deployment URL, and custom domain if set.
 */
export function getTrustedOrigins(): string[] {
  const origins: string[] = ["http://localhost:3000", "http://localhost:3001"];

  if (process.env.VERCEL_BRANCH_URL) {
    origins.push(`https://${process.env.VERCEL_BRANCH_URL}`);
  }

  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);
      origins.push(url.origin);
    } catch {
      // Invalid URL format, skip
    }
  }

  return origins;
}
