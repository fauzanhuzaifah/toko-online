// app/api/seed/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Hapus data lama jika ada
    await prisma.product.deleteMany();

    // Buat data baru
    await prisma.product.createMany({
      data: [
        {
          name: "Kaos Polos Premium",
          price: 150000,
          description: "Kaos katun combed 30s yang nyaman dan adem.",
          image: "https://placehold.co/400x400/EEE/31343C",
        },
        {
          name: "Celana Chino Slim",
          price: 350000,
          description: "Celana chino bahan premium, cocok untuk kerja atau hangout.",
          image: "https://placehold.co/400x400/EEE/31343C",
        },
        {
          name: "Sneakers Putih Klasik",
          price: 500000,
          description: "Sepatu sneakers putih yang cocok dipadukan dengan baju apapun.",
          image: "https://placehold.co/400x400/EEE/31343C",
        },
        {
          name: "Hoodie Zipper Dark",
          price: 275000,
          description: "Hoodie tebal bahan fleece, hangat untuk malam hari.",
          image: "https://placehold.co/400x400/EEE/31343C",
        },
      ],
    });

    return NextResponse.json({ message: "Database Cloud berhasil diisi!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal seeding data" }, { status: 500 });
  }
}