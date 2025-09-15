// app/api/order/paystack/create/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Get logged-in user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    let { items, address, paymentIntentId } = body;

    // 🔹 Normalize items to array [{ product, quantity }]
    let normalizedItems = [];
    if (Array.isArray(items)) {
      normalizedItems = items;
    } else if (items && typeof items === "object") {
      normalizedItems = Object.entries(items).map(([product, quantity]) => ({
        product,
        quantity,
      }));
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid items format" },
        { status: 400 }
      );
    }

    if (!address || normalizedItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    // 🔹 Check for duplicate order if paymentIntentId exists
    if (paymentIntentId) {
      const existingOrder = await Order.findOne({ paymentIntentId });
      if (existingOrder) {
        return NextResponse.json({
          success: true,
          message: "Order already exists",
          order: existingOrder,
        });
      }
    }

    // 🔹 Calculate total and validate stock
    let totalAmount = 0;
    for (const { product, quantity } of normalizedItems) {
      const p = await Product.findById(product);
      if (!p) throw new Error(`Product not found: ${product}`);
      if (p.stock < quantity) throw new Error(`Insufficient stock for ${p.name}`);
      totalAmount += (p.offerPrice || p.price) * quantity;
    }

    // 🔹 Deduct stock
    for (const { product, quantity } of normalizedItems) {
      const p = await Product.findById(product);
      p.stock -= quantity;
      await p.save();
    }

    // 🔹 Create order
    const order = await Order.create({
      userId,
      items: normalizedItems,
      address,
      amount: totalAmount,
      paymentMethod: "paystack",       // ✅ matches schema enum
      paymentStatus: "Pending",        // ✅ pending until webhook confirms
      orderStatus: "Pending",
      paymentIntentId: paymentIntentId || null,
      date: Date.now(),
    });

    // 🔹 Clear user cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    console.log("[PAYSTACK_ORDER_CREATE] Order ID:", order._id);

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("[PAYSTACK_ORDER_CREATE_ERROR]", err);
    return NextResponse.json(
      { success: false, message: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
