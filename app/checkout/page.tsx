"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { processCheckout } from "../actions";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      await processCheckout();
      clearCart();
    } catch (error) {
      console.error("Payment failed", error);
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Keranjang Anda Kosong</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Kembali Belanja
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8"> {/* Padding vertikal diperbesar */}
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
        
        {/* Header dengan Tombol Kembali */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Kembali Belanja
          </Link>
        </div>

        {/* Daftar Item */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-800">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>

        {/* Total & Tombol Bayar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 -mx-6 sm:-mx-8 px-6 sm:px-8 -mb-6 sm:-mb-8 py-6 rounded-b-lg">
          <div className="text-center sm:text-left">
            <p className="text-gray-600 text-sm">Total Pembayaran:</p>
            <p className="text-3xl font-bold text-green-600">
              Rp {total.toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3 rounded text-white font-bold transition shadow ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:scale-95'
            }`}
          >
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
        
      </div>
    </main>
  );
}