import { OrderService } from "@/services/order.service";
import { errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const tran_id = body.get("tran_id") as string;

  if (!tran_id) return errorResponse("Missing transaction ID", 400);

  try {
    await OrderService.updateOrderStatus(tran_id, "CANCELLED");
    
    // Redirect to frontend failure page
    return Response.redirect(`${process.env.FRONTEND_URL}/checkout/fail?tran_id=${tran_id}`);
    } catch {
      return errorResponse("Action failed", 500);
    }
}
