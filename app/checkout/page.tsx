"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { processCheckout } from "../actions"; // Import Server Action

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart(); // Ambil fungsi clearCart
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Panggil Server Action
    await processCheckout();
    
    // Jika redirect berhasil, kode di bawah ini mungkin tidak jalan,
    // tapi untuk jaga-jaga, kita bersihkan keranjang di sini juga
    // (Atau lebih baik bersihkan saat user kembali ke beranda dengan status sukses).
    // Untuk simulasi ini, kita bersihkan setelah proses server selesai.
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Keranjang Anda Kosong</h1>
        <Link href="/" className="text-blue-600 hover:underline">Kembali Belanja</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Checkout</h1>
        
        {/* Daftar Item */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>

        {/* Total & Bayar */}
        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total Pembayaran:</p>
            <p className="text-3xl font-bold text-green-600">
              Rp {total.toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className={`px-6 py-3 rounded text-white font-bold transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isLoading ? "Memproses di Server..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </main>
  );
}