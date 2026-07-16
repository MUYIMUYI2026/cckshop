import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Package, ShoppingCart, Users, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  const statCards = [
    { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Package, color: "bg-blue-500", href: "/admin/products" },
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "bg-green-500", href: "/admin/orders" },
    { label: "Registered Users", value: stats?.totalUsers ?? 0, icon: Users, color: "bg-purple-500", href: "/admin/users" },
    { label: "Contact Inquiries", value: stats?.totalContacts ?? 0, icon: MessageSquare, color: "bg-orange-500", href: "/admin/contacts" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your store.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, href }) => (
            <Link key={label} href={href}>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-300" />
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</div>
                )}
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <Link href="/admin/orders">
              <span className="text-sm text-green-600 hover:text-green-700 font-medium">View all →</span>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto" />
                </div>
              ))
            ) : stats?.recentOrders?.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              stats?.recentOrders?.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`}>
                  <div className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-mono text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                    <div className="text-sm text-gray-600 flex-1">{order.customerName}</div>
                    <div className="text-sm font-medium text-gray-900">${Number(order.total).toFixed(2)}</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/products">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all">
              <Package className="w-6 h-6 mb-3 opacity-80" />
              <div className="font-semibold">Manage Products</div>
              <div className="text-sm opacity-75 mt-1">Add, edit or remove products from your catalog</div>
            </div>
          </Link>
          <Link href="/admin/contacts">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all">
              <MessageSquare className="w-6 h-6 mb-3 opacity-80" />
              <div className="font-semibold">View Inquiries</div>
              <div className="text-sm opacity-75 mt-1">Check wholesale and retail contact submissions</div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
