"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { createOrder } from "../actions";

export default function CheckoutPage() {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Keranjang Anda Kosong</h1>
        <Link href="/" className="text-blue-600 hover:underline">Kembali Belanja</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>
        
        {/* Daftar Produk */}
         <div className="mb-6 border-b pb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              {/* Ubah class di sini agar hitam pekat */}
              <span className="text-gray-900 font-medium">{item.name} x {item.quantity}</span>
              <span className="text-gray-900 font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t text-gray-900">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Form Data Pembeli */}
        <form action={createOrder} className="space-y-4">
          {/* Input Tersembunyi untuk Total */}
          <input type="hidden" name="total" value={total.toString()} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-700"
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp (Aktif)</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-700"
              placeholder="Contoh: 08123456789"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition"
          >
            Lanjutkan ke Pembayaran
          </button>
        </form>
      </div>
    </main>
  );
}