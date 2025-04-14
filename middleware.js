import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request) {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "crunch-time"
  });

  if (!sessionCookie) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage", "/profile"]
};
