// // app/api/webhooks/paystack/route.js
// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import connectDB from "@/config/db";
// import Order from "@/models/Order";
// import User from "@/models/User";

// export async function POST(req) {
//   try {
//     const body = await req.text();
//     const hash = crypto
//       .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
//       .update(body)
//       .digest("hex");

//     const signature = req.headers.get("x-paystack-signature");
//     if (hash !== signature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//     }

//     const event = JSON.parse(body);
//     if (event.event === "charge.success") {
//       await connectDB();

//       const { userId, items, address, paymentMethod } = event.data.metadata;

//       const order = await Order.create({
//         userId,
//         items,
//         address,
//         amount: event.data.amount / 100,
//         paymentMethod,
//         paymentStatus: "Successful",
//         orderStatus: "Order Placed",
//         paymentIntentId: event.data.reference,
//       });

//       // Clear user cart
//       await User.findByIdAndUpdate(userId, { cartItems: {} });

//       console.log("✅ Paystack order created:", order._id);
//     }

//     return NextResponse.json({ received: true });
//   } catch (err) {
//     console.error("[PAYSTACK_WEBHOOK_ERROR]", err);
//     return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
//   }
// }









































import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.text();
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    if (event.event === "charge.success") {
      await connectDB();

      // Parse metadata safely
      let metadata = event.data.metadata || {};
      if (typeof metadata === "string") metadata = JSON.parse(metadata);

      const { userId, items, address, paymentMethod } = metadata;

      // ✅ Idempotency: prevent duplicate Paystack orders
      const existingOrder = await Order.findOne({ paymentIntentId: event.data.reference });
      if (existingOrder) {
        console.log("✅ Paystack order already exists, skipping:", event.data.reference);
        return NextResponse.json({ received: true });
      }

      const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
      const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

      const order = await Order.create({
        orderId: event.data.reference, // unique
        paymentIntentId: event.data.reference,
        userId,
        items: parsedItems,
        address: parsedAddress,
        amount: event.data.amount / 100,
        paymentMethod: paymentMethod || "Paystack",
        paymentStatus: "Successful",
        orderStatus: "Order Placed",
      });

      // Clear user cart
      if (userId) await User.findByIdAndUpdate(userId, { cartItems: {} });

      console.log("✅ Paystack order created:", order._id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[PAYSTACK_WEBHOOK_ERROR]", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
