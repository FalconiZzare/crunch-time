import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request) {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "crunch-time"
  });

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sing-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"] // Specify the routes the middleware applies to
};
