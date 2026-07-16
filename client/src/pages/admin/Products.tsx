import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type ProductForm = {
  name: string; slug: string; description: string; category: "beauty" | "skincare" | "electronics" | "daily";
  retailPrice: string; wholesalePrice: string; minWholesaleQty: number; stock: number;
  imageUrl: string; brand: string; isFeatured: boolean; isBestSeller: boolean; isNewArrival: boolean;
};

const defaultForm: ProductForm = {
  name: "", slug: "", description: "", category: "beauty",
  retailPrice: "", wholesalePrice: "", minWholesaleQty: 10, stock: 0,
  imageUrl: "", brand: "", isFeatured: false, isBestSeller: false, isNewArrival: true,
};

const categoryLabels: Record<string, string> = {
  beauty: "Beauty", skincare: "Skincare", electronics: "Electronics", daily: "Daily Essentials",
};

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.products.list.useQuery({ search: search || undefined, limit: 100 });

  const createMutation = trpc.admin.products.create.useMutation({
    onSuccess: () => { toast.success("Product created!"); setDialogOpen(false); utils.admin.products.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.admin.products.update.useMutation({
    onSuccess: () => { toast.success("Product updated!"); setDialogOpen(false); utils.admin.products.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.admin.products.delete.useMutation({
    onSuccess: () => { toast.success("Product deleted!"); setDeleteId(null); utils.admin.products.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const openCreate = () => { setEditId(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name, slug: p.slug, description: p.description ?? "", category: p.category,
      retailPrice: String(p.retailPrice), wholesalePrice: String(p.wholesalePrice),
      minWholesaleQty: p.minWholesaleQty, stock: p.stock,
      imageUrl: p.imageUrl ?? "", brand: p.brand ?? "",
      isFeatured: p.isFeatured, isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.slug || !form.retailPrice || !form.wholesalePrice) {
      toast.error("Please fill in all required fields"); return;
    }
    const payload = { ...form, imageUrl: form.imageUrl || undefined, brand: form.brand || undefined, description: form.description || undefined };
    if (editId) updateMutation.mutate({ id: editId, ...payload });
    else createMutation.mutate(payload);
  };

  const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">{data?.total ?? 0} products in catalog</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Retail</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Wholesale</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Stock</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Flags</th>
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
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No products found</p>
                  </td></tr>
                ) : (
                  data?.items?.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-400">{p.brand ?? "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {categoryLabels[p.category] ?? p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">${Number(p.retailPrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">${Number(p.wholesalePrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${p.stock <= 5 ? "text-red-600" : "text-gray-900"}`}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {p.isFeatured && <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">Featured</span>}
                          {p.isBestSeller && <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Best</span>}
                          {p.isNewArrival && <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">New</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Product Name *</label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="e.g. Vitamin C Serum" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Slug *</label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="vitamin-c-serum" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Brand</label>
                <Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand name" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Category *</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="skincare">Skincare</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="daily">Daily Essentials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Stock</label>
                <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Retail Price ($) *</label>
                <Input value={form.retailPrice} onChange={e => setForm(f => ({ ...f, retailPrice: e.target.value }))} placeholder="29.99" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Wholesale Price ($) *</label>
                <Input value={form.wholesalePrice} onChange={e => setForm(f => ({ ...f, wholesalePrice: e.target.value }))} placeholder="19.99" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Min Wholesale Qty</label>
                <Input type="number" value={form.minWholesaleQty} onChange={e => setForm(f => ({ ...f, minWholesaleQty: Number(e.target.value) }))} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Image URL</label>
                <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Product description..." />
              </div>
              <div className="col-span-2 flex gap-4">
                {[["isFeatured", "Featured"], ["isBestSeller", "Best Seller"], ["isNewArrival", "New Arrival"]].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form[key as keyof ProductForm] as boolean}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editId ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Product</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })} disabled={deleteMutation.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
