// // app/api/order/paystack/create/route.js
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Product from "@/models/Product";
// import Order from "@/models/Order";
// import User from "@/models/User";
// import { getAuth } from "@clerk/nextjs/server";

// export async function POST(req) {
//   try {
//     await connectDB();

//     // ✅ Get logged-in user
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     let { items, address, reference } = body; // 🔹 Paystack reference will be passed here

//     // 🔹 Normalize items
//     let normalizedItems = [];
//     if (Array.isArray(items)) {
//       normalizedItems = items;
//     } else if (items && typeof items === "object") {
//       normalizedItems = Object.entries(items).map(([product, quantity]) => ({
//         product,
//         quantity,
//       }));
//     } else {
//       return NextResponse.json(
//         { success: false, message: "Invalid items format" },
//         { status: 400 }
//       );
//     }

//     if (!address || normalizedItems.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "Invalid order data" },
//         { status: 400 }
//       );
//     }

//     // 🔹 Check for duplicate order by Paystack reference
//     if (reference) {
//       const existingOrder = await Order.findOne({ referenceId: reference });
//       if (existingOrder) {
//         return NextResponse.json({
//           success: true,
//           message: "Order already exists",
//           order: existingOrder,
//         });
//       }
//     }

//     // 🔹 Calculate total and validate stock
//     let totalAmount = 0;
//     for (const { product, quantity } of normalizedItems) {
//       const p = await Product.findById(product);
//       if (!p) throw new Error(`Product not found: ${product}`);
//       if (p.stock < quantity) throw new Error(`Insufficient stock for ${p.name}`);
//       totalAmount += (p.offerPrice || p.price) * quantity;
//     }

//     // 🔹 Deduct stock
//     for (const { product, quantity } of normalizedItems) {
//       const p = await Product.findById(product);
//       p.stock -= quantity;
//       await p.save();
//     }

//     // 🔹 Create order with Paystack referenceId
//     const order = await Order.create({
//       userId,
//       items: normalizedItems,
//       address,
//       amount: totalAmount,
//       paymentMethod: "paystack",
//       paymentStatus: "Pending",       // ✅ will be updated by webhook
//       orderStatus: "Pending",
//       referenceId: reference || null, // 🔹 store Paystack transaction reference
//       date: Date.now(),
//     });

//     // 🔹 Clear user cart
//     await User.findByIdAndUpdate(userId, { cartItems: {} });

//     console.log("[PAYSTACK_ORDER_CREATE] Order ID:", order._id);

//     return NextResponse.json({
//       success: true,
//       message: "Order created successfully",
//       order,
//     });
//   } catch (err) {
//     console.error("[PAYSTACK_ORDER_CREATE_ERROR]", err);
//     return NextResponse.json(
//       { success: false, message: err.message || "Unexpected error" },
//       { status: 500 }
//     );
//   }
// }






























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

    // ✅ Auth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { items, address, reference } = body; // 🔹 Paystack reference

    // ✅ Normalize items
    let normalizedItems = [];
    if (Array.isArray(items)) {
      normalizedItems = items;
    } else if (items && typeof items === "object") {
      normalizedItems = Object.entries(items).map(([product, quantity]) => ({
        product,
        quantity,
      }));
    } else {
      return NextResponse.json({ success: false, message: "Invalid items format" }, { status: 400 });
    }

    if (!address || normalizedItems.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
    }

    // ✅ Prevent duplicates by reference
    if (reference) {
      const existingOrder = await Order.findOne({ referenceId: reference });
      if (existingOrder) {
        return NextResponse.json({
          success: true,
          message: "Order already exists",
          order: existingOrder,
        });
      }
    }

    // ✅ Build order items with price snapshots
    let totalAmount = 0;
    const orderItems = [];
    for (const { product, quantity } of normalizedItems) {
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

    // ✅ Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      amount: totalAmount,
      paymentMethod: "paystack",
      paymentStatus: "Successful",       // updated in webhook
      orderStatus: "Order Placed",
      referenceId: reference || null, // keep Paystack reference
      date: Date.now(),
    });

    // ✅ Clear user cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    console.log("[PAYSTACK_ORDER_CREATE] Order:", order._id);

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[PAYSTACK_ORDER_CREATE_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
