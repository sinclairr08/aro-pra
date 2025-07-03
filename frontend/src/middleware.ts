import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !(request.nextUrl.pathname === "/admin/login")
  ) {
    try {
      const response = await axios.get(
        `${request.nextUrl.origin}/api/v1/admin/profile`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        },
      );

      if (!response.data.success) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
