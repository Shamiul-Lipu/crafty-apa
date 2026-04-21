import { CartService } from "@/services/order.service";
import { addToCartSchema } from "@/validators/cart.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) return errorResponse("User ID missing", 401);

  const cart = await CartService.getCart(userId);
  return successResponse(cart);
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) return errorResponse("User ID missing", 401);

  const body = await request.json();
  const validated = addToCartSchema.safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid input", 400);

  try {
    const item = await CartService.addToCart(userId, validated.data.productId, validated.data.quantity);
    return successResponse(item, 201);
    } catch {
      return errorResponse("Action failed", 500);
    }
}
