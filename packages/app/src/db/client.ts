import { ConvexReactClient } from "convex/react";

/**
 * Create a Convex React client for use with ConvexProvider.
 * Use the same deployment URL for web (NEXT_PUBLIC_CONVEX_URL) and mobile (EXPO_PUBLIC_CONVEX_URL).
 */
export function createConvexClient(deploymentUrl: string): ConvexReactClient {
  return new ConvexReactClient(deploymentUrl);
}
