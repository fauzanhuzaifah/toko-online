"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// Definisikan tipe Product
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

// KOMPONEN PESAN SUKSES (Dipisah agar bisa pakai Suspense)
function SuccessMessage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      clearCart();
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, clearCart]);

  if (!showSuccess) return null;

  return (
    <div className="max-w-7xl mx-auto mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <strong className="font-bold">Transaksi Berhasil!</strong>
        <span className="block sm:inline ml-2">Terima kasih telah berbelanja di toko kami.</span>
      </div>
      <button onClick={() => setShowSuccess(false)} className="text-green-700 hover:text-green-900 text-2xl font-bold leading-none">&times;</button>
    </div>
  );
}

// KOMPONEN UTAMA
export default function Home() {
  const { addItem, items, total } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Effect untuk mengambil data produk
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal fetch produk:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Bungkus SuccessMessage dengan Suspense */}
      <Suspense fallback={null}>
        <SuccessMessage />
      </Suspense>

      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-800">Toko Online Kami</h1>
          <p className="text-gray-600 mt-2">Data diambil langsung dari Database</p>
        </div>
        
        <Link 
          href="/checkout" 
          className="block bg-white p-4 rounded-lg shadow-md text-right hover:shadow-lg transition cursor-pointer w-full sm:w-auto"
        >
          <p className="text-sm text-gray-500">Total Keranjang:</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {total.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-blue-500 mt-1">Klik untuk Checkout &rarr;</p>
        </Link>
      </header>

      {/* Loading atau Grid Produk */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Memuat produk dari database...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 text-sm mt-1 flex-grow">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  <button 
                    onClick={() => addItem(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm transition"
                  >
                    Beli
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}