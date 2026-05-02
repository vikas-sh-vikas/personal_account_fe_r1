import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const commonPath = path === "/";
  const isPublic = path === "/auth/login" || path === "/auth/signup";
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // const token = request.cookies.get(
  //   process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || ""
  // )?.value;
  if (commonPath && !token?.accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }
  if (commonPath && token?.accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  if (isPublic && token?.accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  if (!isPublic && !token?.accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/dashboard", "/auth/login", "/auth/signup"],
};
