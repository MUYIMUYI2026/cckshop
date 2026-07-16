import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { MessageSquare, Building2, Mail, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminContacts() {
  const { data, isLoading } = trpc.admin.contacts.list.useQuery({ limit: 100 });
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">{data?.total ?? 0} submissions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : data?.items?.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No inquiries yet</p>
                  </td></tr>
                ) : (
                  data?.items?.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                      <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.email}</td>
                      <td className="px-4 py-3 text-gray-500">{c.company ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{c.subject ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        {c.isWholesaleInquiry ? (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">Wholesale</span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">General</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inquiry from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${selected.email}`} className="hover:text-green-600">{selected.email}</a>
              </div>
              {selected.company && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {selected.company}
                </div>
              )}
              {selected.subject && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {selected.subject}
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3 text-gray-700 leading-relaxed">
                {selected.message}
              </div>
              <div className="text-xs text-gray-400">
                Submitted: {new Date(selected.createdAt).toLocaleString()}
                {selected.isWholesaleInquiry && " · Wholesale Inquiry"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
