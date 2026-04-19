import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function getCurrentSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.user?.id || null;
}

export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  return userId;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}
