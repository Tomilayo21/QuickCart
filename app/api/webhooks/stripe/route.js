// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Order from "@/models/Order";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const config = {
//   api: { bodyParser: false },
// };

// export async function POST(req) {
//   const buf = await req.arrayBuffer();
//   const rawBody = Buffer.from(buf);
//   const sig = req.headers.get("stripe-signature");

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       rawBody,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     await connectDB();

//     // ✅ Ensure idempotency
//     const existingOrder = await Order.findOne({ sessionId: session.id });
//     if (!existingOrder) {
//       const order = new Order({
//         sessionId: session.id, // 👈 save sessionId
//         userId: session.metadata.userId,
//         address: JSON.parse(session.metadata.address),
//         items: JSON.parse(session.metadata.items),
//         totalAmount: session.amount_total / 100,
//         paymentStatus: "paid",
//       });

//       await order.save();
//     }
//   }

//   return NextResponse.json({ received: true });
// }





















































import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await connectDB();

    const existingOrder = await Order.findOne({ orderId: session.id });
    if (existingOrder) {
      console.log("✅ Stripe order already exists, skipping:", session.id);
      return NextResponse.json({ received: true });
    }

    const items = JSON.parse(session.metadata.items || "[]");
    const address = JSON.parse(session.metadata.address || "{}");

    const order = await Order.create({
      orderId: session.id,          // unique per Stripe checkout
      sessionId: session.id,
      userId: session.metadata.userId,
      address,
      items,
      amount: session.amount_total / 100,
      paymentMethod: "Stripe",
      orderStatus: "Order Placed",
      paymentStatus: "Successful",
    });

    console.log("✅ Stripe order created:", order._id);
  }

  return NextResponse.json({ received: true });
}
