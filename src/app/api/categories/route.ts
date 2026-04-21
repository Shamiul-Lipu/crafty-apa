import { CategoryService } from "@/services/product.service";
import { categorySchema } from "@/validators/product.validator";
import { successResponse, errorResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET() {
  const categories = await CategoryService.findAll();
  return successResponse(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = categorySchema.safeParse(body);
  
  if (!validated.success) return errorResponse("Invalid category data", 400);

  try {
    const category = await CategoryService.create(validated.data);
    return successResponse(category, 201);
    } catch {
      return errorResponse("Failed to create category", 500);
    }
}
