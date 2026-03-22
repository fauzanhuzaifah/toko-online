"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { logout } from "../actions";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function AdminPage() {
  const [formData, setFormData] = useState({ name: "", price: "", description: "", image: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setMessage(editingId ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!");
        setFormData({ name: "", price: "", description: "", image: "" });
        setEditingId(null);
        fetchProducts();
      } else {
        setMessage("Operasi gagal.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      description: product.description,
      image: product.image,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Gagal hapus", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Bagian Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">
              {editingId ? "Edit Produk" : "Tambah Produk Baru"}
            </h1>
            
            <div className="flex items-center gap-4">
              <form action={logout}>
                <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline">
                  Logout
                </button>
              </form>
              <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                Lihat Toko
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">Nama Produk</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Harga (Rp)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Deskripsi</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">URL Gambar</label>
              <input 
                type="text" 
                name="image" 
                value={formData.image} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" 
                required 
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes("berhasil") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}

            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={loading} 
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? "Menyimpan..." : (editingId ? "Update Produk" : "Simpan Produk")}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setFormData({ name: "", price: "", description: "", image: "" }); }} 
                  className="py-2 px-4 border rounded-md hover:bg-gray-100 text-black"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bagian Daftar Produk */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black">Daftar Produk</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 border px-2 py-1 rounded hover:bg-gray-50">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 border px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}