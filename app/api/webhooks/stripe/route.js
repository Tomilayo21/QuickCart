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
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await connectDB();

    // ✅ Idempotency: avoid duplicate orders
    const existingOrder = await Order.findOne({ orderId: session.id });
    if (!existingOrder) {
      const order = new Order({
        orderId: session.id,  // use session.id as orderId temporarily
        userId: session.metadata.userId,
        address: session.metadata.addressId,
        items: JSON.parse(session.metadata.items),
        amount: session.amount_total / 100,
        paymentMethod: session.metadata.paymentMethod,
        paymentStatus: "Successful",   // ✅ ensures status is always set
        orderStatus: "Order Placed",   // ✅ sets initial order status
      });
      await order.save();
      console.log("Stripe order created:", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
