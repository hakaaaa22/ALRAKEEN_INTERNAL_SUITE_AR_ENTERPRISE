import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith("/app")) {
    const token = req.cookies.get("alrakeen_session")?.value;
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", p);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/app/:path*"] };
