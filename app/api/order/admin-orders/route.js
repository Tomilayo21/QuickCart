import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Address from "@/models/Address";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    await connectDB();

    const orders = await Order.find({})
      .populate("address")
      .populate("items.product");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
