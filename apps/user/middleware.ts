export { auth as middleware } from "@/auth"

// Protect every app route except Next.js internals and the NextAuth handler.
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
