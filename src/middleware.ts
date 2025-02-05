// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;

  if (!token) {
    if (pathname !== "/signin" && pathname !== "/signup") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } else {
    if (pathname === "/signin" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/news", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next).*)"],
};
