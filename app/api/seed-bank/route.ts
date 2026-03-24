import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.bank.deleteMany(); // Hapus data lama
    
    await prisma.bank.createMany({
      data: [
        {
          bankName: "BCA",
          accountNumber: "1234567890",
          accountName: "Nama Anda"
        },
        {
          bankName: "Mandiri",
          accountNumber: "0987654321",
          accountName: "Nama Anda"
        }
      ]
    });
    
    return NextResponse.json({ message: "Bank berhasil ditambahkan!" });
  } catch (e) { 
    return NextResponse.json({ error: "Gagal" }, { status: 500 }); 
  }
}
