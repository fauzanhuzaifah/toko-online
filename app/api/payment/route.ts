import { prisma } from "@/lib/prisma"; // atau "../../lib/prisma"
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Order ID hilang" }, { status: 400 });
  }

  // Ambil data pesanan
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  // Ambil daftar bank
  const banks = await prisma.bank.findMany();

  if (!order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ order, banks });
}