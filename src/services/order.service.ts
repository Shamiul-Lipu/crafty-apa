import { prisma } from "@/lib/prisma";

export class CartService {
  static async getCart(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  static async addToCart(userId: string, productId: string, quantity: number) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  static async updateQuantity(id: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  static async removeFromCart(id: string) {
    return prisma.cartItem.delete({
      where: { id },
    });
  }

  static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      return prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }
}

export class OrderService {
  static async createOrder(userId: string, shippingAddress: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    return prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  static async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { 
        items: { include: { product: true } },
        user: true 
      },
    });
  }

  static async updateOrderStatus(id: string, status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED") {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
