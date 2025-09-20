// // app/api/order/stripe/create/route.js
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Product from "@/models/Product";
// import Order from "@/models/Order";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs/server";

// export async function POST(req) {
//   try {
//     await connectDB();

//     // ✅ Auth
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // ✅ Request body from frontend
//     const { items, address } = await req.json();

//     // ✅ Validate & calculate
//     let total = 0;
//     const normalizedItems = [];
//     for (const { product, quantity } of items) {
//       const p = await Product.findById(product);
//       if (!p) throw new Error(`Product not found: ${product}`);
//       if (p.stock < quantity) throw new Error(`Insufficient stock for ${p.name}`);
//       total += (p.offerPrice || p.price) * quantity;
//       normalizedItems.push({ product, quantity });
//     }

//     // ✅ Deduct stock
//     for (const { product, quantity } of normalizedItems) {
//       const p = await Product.findById(product);
//       p.stock -= quantity;
//       await p.save();
//     }

//     // ✅ Create order directly
//     const order = await Order.create({
//       userId,
//       items: normalizedItems,
//       address,
//       amount: total,
//       paymentMethod: "stripe",     // ✅ lowercase to match schema
//       paymentStatus: "Successful",
//       orderStatus: "Order Placed",
//     });

//     // ✅ Clear cart
//     await User.findByIdAndUpdate(userId, { cartItems: {} });

//     return NextResponse.json({ success: true, order });
//   } catch (err) {
//     console.error("[STRIPE_ORDER_CREATE_ERROR]", err);
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }






































// app/api/order/stripe/create/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Auth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { items, address } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid cart" }, { status: 400 });
    }

    // ✅ Build order items with price snapshots
    let totalAmount = 0;
    const orderItems = [];
    for (const { product, quantity } of items) {
      const p = await Product.findById(product);
      if (!p) throw new Error(`Product not found: ${product}`);
      if (p.stock < quantity) throw new Error(`Insufficient stock for ${p.name}`);

      const snapshotPrice = p.offerPrice || p.price;
      totalAmount += snapshotPrice * quantity;

      orderItems.push({
        product,
        quantity,
        price: snapshotPrice, // 🔹 snapshot
      });

      // Deduct stock
      p.stock -= quantity;
      await p.save();
    }

    // ✅ Create order (assuming Stripe already collected payment)
    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      amount: totalAmount,
      paymentMethod: "stripe",
      paymentStatus: "Successful",   // if you use webhooks, keep this "Pending" instead
      orderStatus: "Order Placed",
      date: Date.now(),
    });

    // ✅ Clear cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    console.log("[STRIPE_ORDER_CREATE] Order:", order._id);

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[STRIPE_ORDER_CREATE_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
