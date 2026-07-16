import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.orders.list.useQuery({ status: statusFilter === "all" ? undefined : statusFilter });
  const { data: orderDetail } = trpc.admin.orders.getById.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null }
  );

  const updateStatus = trpc.admin.orders.updateStatus.useMutation({
    onSuccess: () => { toast.success("Order status updated!"); utils.admin.orders.list.invalidate(); utils.admin.stats.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">{data?.total ?? 0} orders total</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Order #</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : data?.items?.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No orders found</p>
                  </td></tr>
                ) : (
                  data?.items?.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-gray-900">#{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${order.orderType === "wholesale" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                          {order.orderType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">${Number(order.total).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelectedId(order.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order detail dialog */}
      <Dialog open={selectedId !== null} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{orderDetail?.orderNumber}</DialogTitle>
          </DialogHeader>
          {orderDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{orderDetail.customerName}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{orderDetail.customerEmail}</span></div>
                {orderDetail.customerPhone && <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{orderDetail.customerPhone}</span></div>}
                <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{orderDetail.orderType}</span></div>
                <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(orderDetail.createdAt).toLocaleString()}</span></div>
              </div>
              {orderDetail.shippingAddress && (
                <div className="text-sm">
                  <span className="text-gray-500">Shipping Address:</span>
                  <p className="font-medium mt-1">{orderDetail.shippingAddress}</p>
                </div>
              )}

              {/* Items */}
              {orderDetail.items?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Order Items</div>
                  <div className="border border-gray-100 rounded-lg divide-y divide-gray-50">
                    {orderDetail.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-3 py-2 text-sm">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-gray-400 text-xs">Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}</div>
                        </div>
                        <div className="font-medium">${Number(item.subtotal).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm font-semibold border-t border-gray-100 pt-3">
                <span>Total</span>
                <span className="text-lg">${Number(orderDetail.total).toFixed(2)}</span>
              </div>

              {/* Update status */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Update Status</label>
                <div className="flex gap-2">
                  <Select
                    value={orderDetail.status}
                    onValueChange={(v) => updateStatus.mutate({ id: orderDetail.id, status: v as any })}
                  >
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
