import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Users as UsersIcon, Shield, User } from "lucide-react";

export default function AdminUsers() {
  const { data, isLoading } = trpc.admin.users.list.useQuery({ limit: 100 });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.total ?? 0} registered users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Login Method</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Last Sign In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : data?.items?.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No users yet</p>
                  </td></tr>
                ) : (
                  data?.items?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {user.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="font-medium text-gray-900">{user.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            <User className="w-3 h-3" /> User
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{user.loginMethod ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.lastSignedIn).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
