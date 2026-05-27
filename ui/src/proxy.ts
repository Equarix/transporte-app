import { NextRequest, NextResponse } from "next/server";
import { errorWrapper } from "./utils/errorWrapper";
import { instance } from "./config/axios";

const protectedRoutes = ["/perfil"];

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);

  const currentPath = request.nextUrl.pathname;

  headers.set("x-current-path", currentPath);

  if (!protectedRoutes.some((route) => currentPath.startsWith(route))) {
    return NextResponse.next({ headers });
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const [error] = await errorWrapper(async () => {
    const res = await instance.get("/public/auth/revalidate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  });

  if (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
