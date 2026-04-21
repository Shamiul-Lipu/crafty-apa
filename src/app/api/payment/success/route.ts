import { PaymentService } from "@/services/payment.service";
import { OrderService } from "@/services/order.service";
import { errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const tran_id = body.get("tran_id") as string;
  const val_id = body.get("val_id") as string;

  if (!tran_id || !val_id) return errorResponse("Missing payment data", 400);

  try {
    const isValid = await PaymentService.verifyPayment(val_id);
    if (isValid) {
      await OrderService.updateOrderStatus(tran_id, "PAID");
      // Redirect to frontend success page
      return Response.redirect(`${process.env.FRONTEND_URL}/checkout/success?tran_id=${tran_id}`);
    } else {
      await OrderService.updateOrderStatus(tran_id, "CANCELLED");
      return Response.redirect(`${process.env.FRONTEND_URL}/checkout/fail?tran_id=${tran_id}`);
    }
    } catch {
      return errorResponse("Verification failed", 500);
    }
}
