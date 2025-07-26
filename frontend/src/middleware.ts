import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !(request.nextUrl.pathname === "/admin/login")
  ) {
    try {
      const response = await fetch(
        `${process.env.BACKEND_INTERNAL_URL}/api/v1/admin/profile`,
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
    } catch (error) {
      console.error(`[Middleware] error: ${error}`);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
