import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { getAuth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

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
    const { items, address, paymentMethod } = body;

    // ✅ Validate cart format
    if (!items || typeof items !== "object" || Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid cart format. Expected { productId: quantity }" },
        { status: 400 }
      );
    }

    // ✅ Convert cart object → array for later use
    const itemsArray = Object.entries(items).map(([id, qty]) => ({
      product: id,
      quantity: qty,
    }));

    // ✅ Validate ObjectIds
    const validIds = itemsArray
      .map((item) => item.product)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid product IDs in cart" },
        { status: 400 }
      );
    }

    // ✅ Fetch products from DB
    const dbProducts = await Product.find({ _id: { $in: validIds } });

    if (dbProducts.length !== validIds.length) {
      return NextResponse.json(
        { success: false, message: "Some products not found" },
        { status: 404 }
      );
    }

    // ✅ Prepare Stripe line_items
    const line_items = dbProducts.map((product) => {
      const quantity = parseInt(items[product._id.toString()]);
      const price = product.offerPrice;

      if (!quantity || quantity <= 0) {
        throw new Error(`Invalid quantity for product: ${product.name}`);
      }

      const imageUrl =
        product.image?.[0]?.startsWith("https")
          ? product.image[0]
          : "https://via.placeholder.com/300";

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name || "Unnamed Product",
            images: [imageUrl],
          },
          unit_amount: Math.round(price * 100), // Stripe requires cents
        },
        quantity,
      };
    });

    // ✅ Get domain (local fallback)
    const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${domain}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cart`,
      metadata: {
        userId, // 👈 important for webhook
        address: JSON.stringify(address || {}),
        paymentMethod: paymentMethod || "card",
        items: JSON.stringify(itemsArray),
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}










































// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
// import { getAuth } from "@clerk/nextjs/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   await connectDB();

//   try {
//     const { userId } = getAuth(req);
//     const { items, address } = await req.json();

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "No items provided" }, { status: 400 });
//     }

//     // Calculate total
//     let total = 0;
//     const lineItems = [];

//     for (const { product, quantity } of items) {
//       const p = await Product.findById(product);
//       if (!p) throw new Error(`Product not found: ${product}`);
//       if (p.stock < quantity) throw new Error(`Insufficient stock for ${p.name}`);

//       total += p.price * quantity;

//       lineItems.push({
//         price_data: {
//           currency: "usd",
//           product_data: { name: p.name },
//           unit_amount: p.price * 100,
//         },
//         quantity,
//       });
//     }

//     // Create order in DB (pending)
//     const order = await Order.create({
//       user: userId,
//       items,
//       address,
//       amount: total,
//       paymentMethod: "stripe",
//       paymentStatus: "pending",
//     });

//     // Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout`,
//       metadata: { orderId: order._id.toString() }, // 👈 Pass orderId
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (err) {
//     console.error("[STRIPE_CHECKOUT_ERROR]", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }







