import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.info(`[Middleware] cookie=${request.headers.get("cookie")}`);

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
        console.info(`[Middleware] authentication error, data=${data}`);
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (e) {
      console.error(`[Middleware] error: ${e}`);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
