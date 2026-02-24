import { createConvexClient } from "@project-template/db";

const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://your-convex-app.convex.cloud";

export const convex = createConvexClient(convexUrl);
