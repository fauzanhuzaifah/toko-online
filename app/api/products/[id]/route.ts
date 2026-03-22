// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma"; // Jika error ganti jadi "../../../../lib/prisma"
import { NextResponse } from "next/server";

// Fungsi PUT: Update produk
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Perubahan di sini: params sekarang Promise
) {
  try {
    const { id } = await params; // Harus di-await
    const body = await request.json();
    const { name, price, description, image } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price: Number(price), description, image },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Gagal update produk" }, { status: 500 });
  }
}

// Fungsi DELETE: Hapus produk
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Perubahan di sini
) {
  try {
    const { id } = await params; // Harus di-await

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}