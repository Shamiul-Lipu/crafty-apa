import { AuthService } from "@/services/auth.service";
import { registerSchema } from "@/validators/auth.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = registerSchema.safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid input", 400);

  try {
    const user = await AuthService.register(validated.data);
    return successResponse(user, 201);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return errorResponse("Email already exists", 400);
    }
    return errorResponse("Registration failed", 500);
  }
}
