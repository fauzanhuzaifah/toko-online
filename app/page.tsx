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

       {/* ========================================= */}
      {/* TAMBAHAN: TOMBOL CHAT WHATSAPP */}
      {/* ========================================= */}
      <a
        href="https://wa.me/6281321225817?text=Halo%20Admin%2C%20saya%20ingin%20bertanya%20tentang%20produk."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center justify-center group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        {/* Tooltip kecil saat hover */}
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Chat Penjual
        </span>
      </a>
    </main>
  );
}