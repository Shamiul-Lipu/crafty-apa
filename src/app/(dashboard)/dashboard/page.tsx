"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: { title: string; images: string[] };
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
};

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch orders when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    setOrdersLoading(true);
    apiFetch<Order[]>("/api/orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        setOrdersError(err.message);
      })
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
        <p className="text-muted-foreground mb-8 text-lg">Sign in to view your order history and manage your account.</p>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-4">Redirecting to login...</p>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "PAID":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground text-lg">Welcome back, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); router.push("/"); }}>Sign Out</Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "orders" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            >
              Order History
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "profile" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            >
              Profile Settings
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : ordersError ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20">
                  {ordersError}
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm text-center">
                  <p className="text-muted-foreground text-lg mb-4">No orders yet.</p>
                  <Button onClick={() => router.push("/products")}>Start Shopping</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                     <div key={order.id} className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                         <div>
                           <h3 className="font-bold text-lg mb-1">Order #{order.id.slice(-8).toUpperCase()}</h3>
                           <p className="text-muted-foreground text-sm">
                             {new Date(order.createdAt).toLocaleDateString("en-US", {
                               year: "numeric",
                               month: "long",
                               day: "numeric",
                             })} • {order.items.length} items
                           </p>
                         </div>
                         <div className="text-left sm:text-right">
                           <p className="font-bold text-lg mb-1">${order.totalAmount.toFixed(2)}</p>
                           <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                             {order.status}
                           </span>
                         </div>
                       </div>
                       
                       {/* Order items */}
                       <div className="border-t border-border/50 pt-4 mt-2">
                         <div className="space-y-2">
                           {order.items.map((item) => (
                             <div key={item.id} className="flex justify-between text-sm">
                               <span className="text-muted-foreground">
                                 {item.product?.title || "Product"} × {item.quantity}
                               </span>
                               <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm max-w-xl">
              <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-md bg-muted/50" defaultValue={user?.name.split(' ')[0]} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-md bg-muted/50" defaultValue={user?.name.split(' ')[1]} />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border rounded-md bg-muted/50" defaultValue={user?.email} disabled />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Role</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md bg-muted/50" defaultValue={user?.role} disabled />
                </div>
                <Button>Save Changes</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
