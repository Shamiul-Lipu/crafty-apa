⚡ Feature List (MVP-focused)
User
Browse products (chocolate, gifts, handmade)
Product details (images, story, price)
Search + filter
Cart (add/update/remove)
Checkout (address + order)
Auth (register/login/logout)
Order history
Admin
Dashboard (orders, sales)
Product CRUD
Category CRUD
Order management (status update)

🔗 API List (Next.js App Router Structure)
📁 Auth
/app/api/auth/register/route.ts → POST
/app/api/auth/login/route.ts → POST
/app/api/auth/me/route.ts → GET
/app/api/auth/logout/route.ts → POST

📁 Products
/app/api/products/route.ts → GET, POST
/app/api/products/[id]/route.ts → GET, PUT, DELETE

📁 Categories
/app/api/categories/route.ts → GET, POST
/app/api/categories/[id]/route.ts → PUT, DELETE

📁 Cart
/app/api/cart/route.ts → GET, POST
/app/api/cart/[id]/route.ts → PUT, DELETE

📁 Orders
/app/api/orders/route.ts → GET, POST
/app/api/orders/[id]/route.ts → GET, PATCH

📁 Payment (SSLCommerz - Bangladesh)
/app/api/payment/init/route.ts → POST
/app/api/payment/success/route.ts → POST
/app/api/payment/fail/route.ts → POST

📁 Upload
/app/api/upload/route.ts → POST

🧠 Notes (Next.js Friendly)
Use Route Handlers (route.ts)
Use Server Actions for form submit where possible
Context API → cart + auth state
Protect routes via middleware (/middleware.ts)
Keep logic modular (services/, lib/)

If you want next:
👉 Prisma schema
👉 folder structure
👉 or actual route handler code
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

enum Role {
USER
ADMIN
}

enum OrderStatus {
PENDING
PAID
SHIPPED
DELIVERED
CANCELLED
}

model User {
id String @id @default(uuid())
name String
email String @unique
password String
role Role @default(USER)
orders Order[]
createdAt DateTime @default(now())
}

model Category {
id String @id @default(uuid())
name String
products Product[]
}

model Product {
id String @id @default(uuid())
title String
description String
price Float
stock Int
images String[]
categoryId String
category Category @relation(fields: [categoryId], references: [id])
createdAt DateTime @default(now())
}

model Cart {
id String @id @default(uuid())
userId String @unique
user User @relation(fields: [userId], references: [id])
items CartItem[]
}

model CartItem {
id String @id @default(uuid())
cartId String
productId String
quantity Int

cart Cart @relation(fields: [cartId], references: [id])
product Product @relation(fields: [productId], references: [id])
}

model Order {
id String @id @default(uuid())
userId String
user User @relation(fields: [userId], references: [id])
status OrderStatus @default(PENDING)
totalAmount Float
shippingAddress String
items OrderItem[]
createdAt DateTime @default(now())
}

model OrderItem {
id String @id @default(uuid())
orderId String
productId String
quantity Int
price Float

order Order @relation(fields: [orderId], references: [id])
product Product @relation(fields: [productId], references: [id])
}
