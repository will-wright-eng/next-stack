"use client";

import { createAuthClient } from "better-auth/react";
import { getBetterAuthUrlClient } from "./env";

export const authClient = createAuthClient({
  baseURL: getBetterAuthUrlClient(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
