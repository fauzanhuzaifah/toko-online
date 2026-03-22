"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// --- FUNGSI TRANSAKSI (Yang hilang tadi) ---
export async function processCheckout() {
  // Di aplikasi nyata, di sini Anda akan:
  // 1. Menghubungi payment gateway (Midtrans, Stripe, dll).
  // 2. Menyimpan data ke database (PostgreSQL, MySQL).
  
  console.log("Server: Memproses transaksi...");

  // Simulasi proses server yang memakan waktu
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Server: Transaksi berhasil!");

  // Arahkan pengguna ke halaman sukses
  redirect("/?success=true");
}

// --- FUNGSI LOGIN ---
export async function login(formData: FormData) {
  const password = formData.get("password");
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    (await cookies()).set("admin_session", "valid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });
    redirect("/admin");
  } else {
    redirect("/admin/login?error=true");
  }
}

// --- FUNGSI LOGOUT ---
export async function logout() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}