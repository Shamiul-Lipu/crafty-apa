import { CartService } from "@/services/order.service";
import { updateCartItemSchema } from "@/validators/cart.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const body = await request.json();
  const validated = updateCartItemSchema.safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid input", 400);

  try {
    const item = await CartService.updateQuantity(resolvedParams.id, validated.data.quantity);
    return successResponse(item);
    } catch {
      return errorResponse("Action failed", 500);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    await CartService.removeFromCart(resolvedParams.id);
    return successResponse({ message: "Removed" });
    } catch {
      return errorResponse("Action failed", 500);
    }
}
