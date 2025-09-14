import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function GET(req, { params }) {
  await connectDB();
  const order = await Order.findOne({ sessionId: params.sessionId });

  if (!order) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({ exists: true, order });
}
