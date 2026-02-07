import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ONLY_ROUTES = ["/stats"];

export async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = Boolean(token);
  const callbackUrl = encodeURIComponent(
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  if (!isAuthenticated) {
    const loginUrl = new URL(`/login?callbackUrl=${callbackUrl}`, request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/job/:path*", "/stats/:path*"],
};

