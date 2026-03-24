"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function PaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false); // State baru

  useEffect(() => {
    if (orderId) {
      fetch(`/api/payment?orderId=${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data.order);
          setBanks(data.banks);
          setLoading(false);
        });
    }
  }, [orderId]);

  const handleWhatsApp = async () => {
    if (!selectedBank || !order) return;

    // 1. Update status order menjadi 'PROCESSING' (opsional, via API)
    // Untuk simpelnya, kita langsung tampilkan pesan sukses dulu.
    
    setIsConfirmed(true); // Ubah tampilan ke mode "Terima Kasih"

    // 2. Buka WhatsApp
    const adminNumber = "6281234567890"; // GANTI DENGAN NOMOR WA PENJUAL
    const message = `Halo Admin, saya ingin konfirmasi pembayaran.
    
*Detail Pesanan:*
ID: ${order.id}
Nama: ${order.customerName}
Total: Rp ${order.total.toLocaleString("id-ID")}

*Saya akan transfer ke:*
Bank: ${selectedBank.bankName}
No. Rekening: ${selectedBank.accountNumber}

Mohon dicek. Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${adminNumber}?text=${encodedMessage}`;
    
    window.open(waLink, "_blank");
  };

  // ... (Loading dan Error state tetap sama) ...
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Pesanan tidak ditemukan.</div>;

  // TAMPILAN SETELAH KLIK WHATSAPP
  if (isConfirmed) {
    return (
      <main className="min-h-screen bg-green-50 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Pesanan Diterima!</h1>
          <p className="text-gray-600 mb-6">
            Silakan selesaikan pembayaran dan chat penjual via WhatsApp yang baru terbuka.
          </p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold inline-block hover:bg-blue-700">
            Kembali Berbelanja
          </Link>
        </div>
      </main>
    );
  }

  // TAMPILAN AWAL (PILIH BANK)
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Instruksi Pembayaran</h1>
        <p className="text-sm text-gray-500 mb-6">Order ID: {order.id}</p>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
          <p className="text-sm text-gray-600">Total Pembayaran</p>
          <p className="text-3xl font-bold text-blue-600">
            Rp {order.total.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Pilih Metode Transfer:</h2>
          <div className="space-y-3">
            {banks.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className={`p-4 border rounded-lg cursor-pointer transition flex justify-between items-center ${
                  selectedBank?.id === bank.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="font-bold text-gray-800">{bank.bankName}</p>
                  <p className="text-gray-600">{bank.accountNumber}</p>
                  <p className="text-sm text-gray-400">a.n {bank.accountName}</p>
                </div>
                {selectedBank?.id === bank.id && (
                  <span className="text-blue-600 font-bold text-xl">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleWhatsApp}
          disabled={!selectedBank}
          className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
            selectedBank
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {/* Icon WA */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
             <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Konfirmasi via WhatsApp
        </button>
      </div>
    </main>
  );
}

export default function PaymentInstructionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}