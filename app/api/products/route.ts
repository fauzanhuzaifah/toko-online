// app/api/products/route.ts
import { prisma } from "@/lib/prisma"; // atau "../../../lib/prisma"
import { NextResponse } from "next/server";

// Fungsi GET (yang sudah ada sebelumnya)
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

// Fungsi POST (Untuk menambah produk baru)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, image } = body;

    // Validasi sederhana
    if (!name || !price || !description || !image) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: Number(price), // Pastikan price adalah number
        description,
        image,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah produk" }, { status: 500 });
  }
}