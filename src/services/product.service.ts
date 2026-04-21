import { prisma } from "@/lib/prisma";

export class CategoryService {
  static async create(data: { name: string }) {
    return prisma.category.create({ data });
  }

  static async findAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  static async update(id: string, name: string) {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  static async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export class ProductService {
  static async create(data: { title: string; description: string; price: number; stock: number; images: string[]; categoryId: string }) {
    return prisma.product.create({ data });
  }

  static async findMany(filters: { categoryId?: string | null; search?: string | null; minPrice?: string | null; maxPrice?: string | null } = {}) {
    const { categoryId, search, minPrice, maxPrice } = filters;
    return prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice && { gte: parseFloat(minPrice) }),
                ...(maxPrice && { lte: parseFloat(maxPrice) }),
              },
            }
          : {}),
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  static async update(id: string, data: Partial<{ title: string; description: string; price: number; stock: number; images: string[]; categoryId: string }>) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
