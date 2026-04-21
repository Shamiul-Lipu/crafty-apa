import { AuthService } from "@/services/auth.service";
import { loginSchema } from "@/validators/auth.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = loginSchema.safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid email or password", 400);

  const user = await AuthService.findUserByEmail(validated.data.email);
  if (!user || !(await AuthService.comparePassword(validated.data.password, user.password))) {
    return errorResponse("Invalid credentials", 401);
  }

  const token = AuthService.generateToken({ id: user.id, email: user.email, role: user.role });
  
  return successResponse({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}
