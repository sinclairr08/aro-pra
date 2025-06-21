import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin") {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get("adminToken")?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      const payload = JSON.parse(
        Buffer.from(adminToken.split(".")[1], "base64").toString(),
      );
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        const response = NextResponse.redirect(new URL("/admin", request.url));
        response.cookies.delete("adminToken");
        return response;
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("adminToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
