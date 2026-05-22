import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Exclude the Clerk account catch-all route from middleware protection so
// the <UserProfile/> component can render routing internals correctly.
export const config = {
  matcher: ["/((?!_next|.*\\..*|account.*).*)", "/api/(.*)"]
};