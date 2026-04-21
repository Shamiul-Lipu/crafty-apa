import { OrderService } from "@/services/order.service";
import { orderSchema } from "@/validators/cart.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) return errorResponse("User ID missing", 401);

  const orders = await OrderService.getUserOrders(userId);
  return successResponse(orders);
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) return errorResponse("User ID missing", 401);

  const body = await request.json();
  const validated = orderSchema.safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid input", 400);

  try {
    const order = await OrderService.createOrder(userId, validated.data.shippingAddress);
    return successResponse(order, 201);
    } catch {
      return errorResponse("Order creation failed", 500);
    }
}
