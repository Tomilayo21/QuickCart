// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Product from "@/models/Product";
// import mongoose from "mongoose";
// import { getAuth } from "@clerk/nextjs/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   await connectDB();

//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { items, address, paymentMethod } = body;

//     // ✅ Validate items is an object with productId: quantity
//     if (!items || typeof items !== "object" || Array.isArray(items)) {
//       throw new Error("❌ Invalid cart format. Expected object with productId: quantity");
//     }

//     // ✅ Convert to array for metadata storage and future use
//     const itemsArray = Object.keys(items).map(id => ({
//       product: id,
//       quantity: items[id],
//     }));

//     const itemIds = Object.keys(items).filter(id =>
//       mongoose.Types.ObjectId.isValid(id)
//     );

//     if (itemIds.length === 0) {
//       throw new Error("❌ No valid product IDs in cart");
//     }

//     const dbProducts = await Product.find({ _id: { $in: itemIds } });

//     if (dbProducts.length !== itemIds.length) {
//       throw new Error("❌ Some products were not found in the database");
//     }

//     const line_items = dbProducts.map((product) => {
//       const quantity = parseInt(items[product._id.toString()]);
//       const price = product.offerPrice;

//       if (!quantity || quantity <= 0) {
//         throw new Error(`❌ Invalid quantity for product: ${product.name}`);
//       }

//       const imageUrl = (product.image?.[0] || "").startsWith("https")
//         ? product.image[0]
//         : "https://via.placeholder.com/300";

//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name || "Unnamed Product",
//             images: [imageUrl],
//           },
//           unit_amount: Math.round(price * 100),
//         },
//         quantity,
//       };
//     });

//     const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${domain}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${domain}/cart`,
//       metadata: {
//         address: JSON.stringify(address),
//         paymentMethod,
//         items: JSON.stringify(itemsArray), // ✅ Store as array
//       },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.error("[STRIPE CHECKOUT ERROR]", error);
//     return NextResponse.json(
//       { error: "Stripe Checkout failed: " + error.message },
//       { status: 500 }
//     );
//   }
// }


























// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Product from "@/models/Product";
// import mongoose from "mongoose";
// import { getAuth } from "@clerk/nextjs/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2023-10-16",
// });

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
//     const { items, address, paymentMethod } = body;

//     // ✅ Validate cart format
//     if (!items || typeof items !== "object" || Array.isArray(items)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid cart format. Expected { productId: quantity }" },
//         { status: 400 }
//       );
//     }

//     // ✅ Convert cart object → array for later use
//     const itemsArray = Object.entries(items).map(([id, qty]) => ({
//       product: id,
//       quantity: qty,
//     }));

//     // ✅ Validate ObjectIds
//     const validIds = itemsArray
//       .map((item) => item.product)
//       .filter((id) => mongoose.Types.ObjectId.isValid(id));

//     if (validIds.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No valid product IDs in cart" },
//         { status: 400 }
//       );
//     }

//     // ✅ Fetch products from DB
//     const dbProducts = await Product.find({ _id: { $in: validIds } });

//     if (dbProducts.length !== validIds.length) {
//       return NextResponse.json(
//         { success: false, message: "Some products not found" },
//         { status: 404 }
//       );
//     }

//     // ✅ Prepare Stripe line_items
//     const line_items = dbProducts.map((product) => {
//       const quantity = parseInt(items[product._id.toString()]);
//       const price = product.offerPrice;

//       if (!quantity || quantity <= 0) {
//         throw new Error(`Invalid quantity for product: ${product.name}`);
//       }

//       const imageUrl =
//         product.image?.[0]?.startsWith("https")
//           ? product.image[0]
//           : "https://via.placeholder.com/300";

//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name || "Unnamed Product",
//             images: [imageUrl],
//           },
//           unit_amount: Math.round(price * 100), // Stripe requires cents
//         },
//         quantity,
//       };
//     });

//     // ✅ Get domain (local fallback)
//     const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

//     // ✅ Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items,
//       success_url: `${domain}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${domain}/cart`,
//       metadata: {
//         userId, // 👈 important for webhook
//         address: JSON.stringify(address || {}),
//         paymentMethod: paymentMethod || "card",
//         items: JSON.stringify(itemsArray),
//       },
//     });

//     return NextResponse.json({ success: true, url: session.url });
//   } catch (error) {
//     console.error("[CHECKOUT_ERROR]", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }





















import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { getAuth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { items, address, paymentMethod } = await req.json();

    if (!items || typeof items !== "object" || Array.isArray(items))
      return NextResponse.json({ success: false, message: "Invalid cart format" }, { status: 400 });

    const itemsArray = Object.entries(items).map(([id, qty]) => ({ product: id, quantity: qty }));
    const validIds = itemsArray.map(i => i.product).filter(id => mongoose.Types.ObjectId.isValid(id));
    const dbProducts = await Product.find({ _id: { $in: validIds } });

    const line_items = dbProducts.map(product => {
      const quantity = parseInt(items[product._id.toString()]);
      const price = product.offerPrice || 0;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image?.[0] ? [product.image[0]] : ["https://via.placeholder.com/300"],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });

    const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

    // ✅ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${domain}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/cart`,
      metadata: {
        userId,
        address: JSON.stringify(address || {}),
        paymentMethod: paymentMethod || "card",
        items: JSON.stringify(itemsArray),
      },
    });

    // ✅ Create order in DB immediately with status "pending"
    const order = new Order({
      sessionId: session.id,
      userId,
      address: address || {},
      items: itemsArray,
      totalAmount: session.amount_total / 100,
      paymentStatus: "pending",
      orderStatus: "Pending",
    });
    await order.save();

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
