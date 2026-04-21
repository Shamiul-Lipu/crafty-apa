import { ProductService } from "@/services/product.service";
import { productSchema } from "@/validators/product.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    categoryId: searchParams.get("categoryId"),
    search: searchParams.get("search"),
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
  };

  const products = await ProductService.findMany(filters);
  return successResponse(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = productSchema.safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid product data", 400);

  try {
    const product = await ProductService.create(validated.data);
    return successResponse(product, 201);
  } catch {
    return errorResponse("Failed to create product", 500);
  }
}
