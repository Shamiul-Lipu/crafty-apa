import { PaymentService } from "@/services/payment.service";
import { OrderService } from "@/services/order.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) return errorResponse("User ID missing", 401);

  const body = await request.json();
  const { orderId } = body;

  if (!orderId) return errorResponse("Order ID missing", 400);

  try {
    const order = await OrderService.getOrderById(orderId);
    if (!order) return errorResponse("Order not found", 404);

    const paymentSession = await PaymentService.initializePayment(
      order.id, 
      order.totalAmount
    );

    return successResponse(paymentSession);
  } catch {
    return errorResponse("Payment initialization failed", 500);
  }
}
