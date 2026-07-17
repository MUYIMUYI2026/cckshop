import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  User, Package, Lock, ChevronRight, ArrowLeft,
  Eye, EyeOff, CheckCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuyerAuth } from "@/hooks/useBuyerAuth";
import { toast } from "sonner";

type Tab = "profile" | "orders" | "password";

type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
};

type Order = {
  id: number;
  orderNumber: string;
  status: string;
  orderType: string;
  total: string;
  createdAt: string;
  customerName: string;
  shippingAddress: string | null;
  items?: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const [, navigate] = useLocation();
  const { buyer, isAuthenticated, loading, logout } = useBuyerAuth();
  const initialTab = (new URLSearchParams(window.location.search).get("tab") as Tab) ?? "profile";
  const [tab, setTab] = useState<Tab>(initialTab);

  // Profile state
  const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  // Load profile
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/buyer-auth/profile", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setProfile({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
        });
      });
  }, [isAuthenticated]);

  // Load orders when tab switches
  useEffect(() => {
    if (tab !== "orders" || !isAuthenticated) return;
    setOrdersLoading(true);
    fetch("/api/buyer-auth/orders", { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setOrdersLoading(false));
  }, [tab, isAuthenticated]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.firstName || !profile.lastName) {
      toast.error("First and last name are required");
      return;
    }
    setProfileLoading(true);
    try {
      const res = await fetch("/api/buyer-auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone }),
        credentials: "include",
      });
      if (res.ok) {
        setProfileSaved(true);
        toast.success("Profile updated successfully");
        setTimeout(() => setProfileSaved(false), 3000);
      } else {
        const d = await res.json();
        toast.error(d.error ?? "Failed to update profile");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (pwForm.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/buyer-auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Password changed successfully");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        const d = await res.json();
        toast.error(d.error ?? "Failed to change password");
      }
    } finally {
      setPwLoading(false);
    }
  };

  const viewOrderDetail = async (order: Order) => {
    const res = await fetch(`/api/buyer-auth/orders/${order.id}`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setSelectedOrder(data);
    } else {
      setSelectedOrder(order);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Avatar */}
              <div className="p-5 border-b border-gray-100 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                  {profile.firstName?.[0]?.toUpperCase() ?? "?"}
                </div>
                <p className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</p>
                <p className="text-xs text-gray-400 truncate">{profile.email}</p>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {[
                  { key: "profile" as Tab, icon: User, label: "Profile" },
                  { key: "orders" as Tab, icon: Package, label: "My Orders" },
                  { key: "password" as Tab, icon: Lock, label: "Change Password" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => { setTab(key); setSelectedOrder(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      tab === key
                        ? "bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-opacity ${tab === key ? "opacity-100" : "opacity-0"}`} />
                  </button>
                ))}
              </nav>

              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="w-full text-sm text-red-500 hover:text-red-700 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {tab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Personal Information</h2>
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <Input
                        value={profile.firstName}
                        onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <Input
                        value={profile.lastName}
                        onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <Input value={profile.email} disabled className="bg-gray-50 text-gray-400" />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={profileLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    {profileSaved && (
                      <span className="flex items-center gap-1.5 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" /> Saved!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {tab === "orders" && !selectedOrder && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">My Orders</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No orders yet</p>
                    <p className="text-sm text-gray-400 mb-4">When you place an order, it will appear here.</p>
                    <Link href="/shop">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => viewOrderDetail(order)}
                        className="border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:bg-green-50/30 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-gray-900 text-sm">#{order.orderNumber}</span>
                            <span className="ml-2 text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                              {order.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 capitalize">{order.orderType} order</span>
                          <span className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Order Detail */}
            {tab === "orders" && selectedOrder && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Orders
                </button>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Order #{selectedOrder.orderNumber}</h2>
                    <p className="text-sm text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[selectedOrder.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Order items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">${Number(item.subtotal).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Order Type</span>
                    <span className="capitalize font-medium">{selectedOrder.orderType}</span>
                  </div>
                  {selectedOrder.shippingAddress && (
                    <div className="flex justify-between text-gray-600">
                      <span>Ship To</span>
                      <span className="text-right max-w-[200px] text-xs">{selectedOrder.shippingAddress}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-200 mt-1">
                    <span>Total</span>
                    <span>${Number(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {tab === "password" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Change Password</h2>
                <form onSubmit={changePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPw ? "text" : "password"}
                        value={pwForm.current}
                        onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                        placeholder="••••••••"
                        className="pr-10"
                        required
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <Input
                      type={showPw ? "text" : "password"}
                      value={pwForm.next}
                      onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                      placeholder="Min. 8 characters"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <Input
                      type={showPw ? "text" : "password"}
                      value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                      placeholder="Re-enter new password"
                      required
                    />
                    {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={pwLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {pwLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
