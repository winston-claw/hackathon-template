import { createConvexClient } from "@project-template/db";

const url =
  process.env.EXPO_PUBLIC_CONVEX_URL ||
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  "";

export const convex = createConvexClient(url);
