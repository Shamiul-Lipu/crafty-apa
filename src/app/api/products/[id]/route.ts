import { ProductService } from "@/services/product.service";
import { productSchema } from "@/validators/product.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await ProductService.findById(resolvedParams.id);
  if (!product) return errorResponse("Product not found", 404);
  return successResponse(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const body = await request.json();
  const validated = productSchema.partial().safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid product data", 400);

  try {
    const product = await ProductService.update(resolvedParams.id, validated.data);
    return successResponse(product);
    } catch {
      return errorResponse("Update failed", 500);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    await ProductService.delete(resolvedParams.id);
    return successResponse({ message: "Deleted" });
    } catch {
      return errorResponse("Delete failed", 500);
    }
}
