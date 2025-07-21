import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !(request.nextUrl.pathname === "/admin/login")
  ) {
    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/v1/admin/profile`,
        {
          headers: {
            Cookie: request.headers.get("cookie") ?? "",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
