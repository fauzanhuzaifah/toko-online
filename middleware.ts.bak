// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // Jika akses /admin tapi tidak punya session dan bukan di halaman login
  if (request.nextUrl.pathname.startsWith("/admin") && !isLoginPage) {
    if (!session || session.value !== "valid") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};