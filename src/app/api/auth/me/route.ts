import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) return errorResponse("User ID missing", 401);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  if (!user) return errorResponse("User not found", 404);
  return successResponse(user);
}

export async function POST() {
  // In case of JWT with cookies, clear cookie here.
  return successResponse({ message: "Logged out" });
}
