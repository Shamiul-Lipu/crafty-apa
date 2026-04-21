import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class AuthService {
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  static generateToken(payload: { id: string; email: string; role: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    } catch {
      return null;
    }
  }

  static async register(data: { name: string; email: string; password: string }) {
    const hashedPassword = await this.hashPassword(data.password);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}
