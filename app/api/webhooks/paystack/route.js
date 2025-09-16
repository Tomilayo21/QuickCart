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

//       const reference = event.data.reference;

//       // ✅ Find existing order by Paystack reference
//       const order = await Order.findOne({ referenceId: reference });
//       if (order) {
//         order.paymentStatus = "Successful";
//         order.orderStatus = "Order Placed";
//         await order.save();

//         // Clear user cart after success
//         await User.findByIdAndUpdate(order.userId, { cartItems: {} });

//         console.log("✅ Paystack order updated:", order._id);
//       } else {
//         console.warn("⚠️ Paystack success but no matching order found:", reference);
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (err) {
//     console.error("[PAYSTACK_WEBHOOK_ERROR]", err);
//     return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
//   }
// }


























































// app/api/order/paystack/webhook/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";

// ✅ Prevent Next.js from parsing body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      await connectDB();

      const reference = event.data.reference;

      // ✅ Find order by reference
      const order = await Order.findOne({ referenceId: reference });
      if (order) {
        order.paymentStatus = "Successful";
        order.orderStatus = "Order Placed";
        await order.save();

        await User.findByIdAndUpdate(order.userId, { cartItems: {} });

        console.log("✅ Paystack order updated:", order._id);
      } else {
        console.warn("⚠️ Paystack success but no matching order:", reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[PAYSTACK_WEBHOOK_ERROR]", err);
    return NextResponse.json({ error: err.message || "Webhook failed" }, { status: 500 });
  }
}
