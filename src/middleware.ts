import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect internal routes only
  if (pathname.startsWith("/api/cart") || pathname.startsWith("/api/orders") || pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      
      // Admin protection
      if (pathname.startsWith("/api/admin") && decoded.role !== "ADMIN") {
        return NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 });
      }

      // Add user info to headers for downstream access
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", decoded.id);
      requestHeaders.set("x-user-role", decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/cart/:path*", "/api/orders/:path*", "/api/admin/:path*"],
};
