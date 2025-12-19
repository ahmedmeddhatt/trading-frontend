import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Log all requests
  console.log(`[MIDDLEWARE] ${request.method} ${pathname}`, {
    url: request.url,
    pathname,
    searchParams: request.nextUrl.searchParams.toString(),
  });

  // Check if route exists (basic validation)
  const validRoutes = [
    "/",
    "/dashboard",
    "/positions",
    "/companies",
    "/company",
    "/transactions",
    "/logs",
  ];

  const isDynamicRoute = pathname.startsWith("/company/") || 
                         pathname.startsWith("/transactions/");

  const isValidRoute = validRoutes.some(route => pathname === route) || 
                        isDynamicRoute;

  // Allow service worker, manifest, and favicon files
  if (pathname === "/sw.js" || 
      pathname === "/manifest.json" || 
      pathname === "/favicon.png" ||
      pathname === "/favicon.ico" ||
      pathname.startsWith("/icon-")) {
    return NextResponse.next();
  }

  if (!isValidRoute && 
      !pathname.startsWith("/_next") && 
      !pathname.startsWith("/api")) {
    console.warn(`[MIDDLEWARE] 404 - Route not found: ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|sw.js|manifest.json|icon-).*)",
  ],
};
