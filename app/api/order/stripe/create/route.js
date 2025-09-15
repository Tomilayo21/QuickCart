import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { items, address } = await req.json();

    // Validate + calculate
    let total = 0;
    const normalizedItems = [];
    for (const { product, quantity } of items) {
      const p = await Product.findById(product);
      if (!p) throw new Error(`Product not found: ${product}`);
      if (p.stock < quantity) throw new Error(`Insufficient stock for ${p.name}`);
      total += (p.offerPrice || p.price) * quantity;
      normalizedItems.push({ product, quantity });
    }

    // Deduct stock
    for (const { product, quantity } of normalizedItems) {
      const p = await Product.findById(product);
      p.stock -= quantity;
      await p.save();
    }

    const order = await Order.create({
      userId,
      items: normalizedItems,
      address,
      amount: total,
      paymentMethod: "Stripe",
      paymentStatus: "Pending", // final status comes via webhook
      orderStatus: "Pending",
    });

    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[STRIPE_ORDER_CREATE_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
