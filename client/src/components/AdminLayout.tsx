import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  LogOut,
  ChevronRight,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/"; },
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-sm">CCKShop</div>
          <div className="text-xs text-gray-400">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = location === href || (href !== "/admin" && location.startsWith(href));
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-2">
        <Link href="/" onClick={() => setSidebarOpen(false)}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
            <Store className="w-4 h-4" />
            View Store
          </div>
        </Link>
        <button
          onClick={() => logoutMutation.mutate()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-900/50 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">{user?.name ?? "Admin"}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email ?? ""}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-60 shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-md text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900">CCKShop Admin</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
