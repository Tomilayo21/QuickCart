
// //Stripe only
// // import { inngest } from "@/config/inngest";
// // import Product from "@/models/Product";
// // import User from "@/models/User";
// // import { getAuth } from "@clerk/nextjs/server";
// // import { NextResponse } from "next/server";
// // import connectDB from "@/config/db";

// // export async function POST(request) {
// //   try {
// //     await connectDB();

// //     const { userId } = getAuth(request);
// //     if (!userId) {
// //       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
// //     }

// //     let body;
// //     try {
// //       body = await request.json();
// //     } catch {
// //       return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
// //     }

// //     console.log("[ORDER_CREATE_REQUEST_BODY]", body);

// //     let { address, items, paymentMethod } = body;

// //     // 🔹 Normalize items: if it's an object, convert to array
// //     if (items && !Array.isArray(items) && typeof items === "object") {
// //       items = Object.entries(items).map(([product, quantity]) => ({
// //         product,
// //         quantity,
// //       }));
// //     }

// //     if (!address || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
// //       return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
// //     }

// //     // Validate stock + calculate total
// //     let totalAmount = 0;
// //     for (const item of items) {
// //       if (!item.product || !item.quantity) {
// //         return NextResponse.json({ success: false, message: "Each item must have product + quantity" }, { status: 400 });
// //       }

// //       const product = await Product.findById(item.product);
// //       if (!product) {
// //         return NextResponse.json({ success: false, message: `Product not found: ${item.product}` }, { status: 404 });
// //       }

// //       if (product.stock < item.quantity) {
// //         return NextResponse.json(
// //           { success: false, message: `Insufficient stock for ${product.name}` },
// //           { status: 400 }
// //         );
// //       }

// //       totalAmount += product.price * item.quantity;
// //     }

// //     // Deduct stock
// //     for (const item of items) {
// //       const product = await Product.findById(item.product);
// //       product.stock -= item.quantity;
// //       await product.save();
// //     }

// //     // Fire Inngest event
// //     await inngest.send({
// //       name: "order/created",
// //       data: {
// //         userId,
// //         address,
// //         items,
// //         amount: totalAmount,
// //         date: Date.now(),
// //         paymentMethod,
// //         status: "Order Placed",
// //       },
// //     });

// //     // Clear cart
// //     const user = await User.findById(userId);
// //     if (user) {
// //       user.cartItems = {};
// //       await user.save();
// //     }

// //     return NextResponse.json({ success: true, message: "Order created successfully" });
// //   } catch (error) {
// //     console.error("[ORDER_POST_ERROR]", error);
// //     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
// //   }
// // }































































// //PayStack only
// // import { inngest } from "@/config/inngest";
// // import Product from "@/models/Product";
// // import User from "@/models/User";
// // import Order from "@/models/Order";
// // import connectDB from "@/config/db";
// // import { getAuth } from "@clerk/nextjs/server";
// // import { NextResponse } from "next/server";

// // export async function POST(request) {
// //   try {
// //     await connectDB();

// //     const { userId } = getAuth(request);
// //     if (!userId) {
// //       return NextResponse.json(
// //         { success: false, message: "Unauthorized" },
// //         { status: 401 }
// //       );
// //     }

// //     const body = await request.json();
// //     console.log("[ORDER_CREATE_REQUEST_BODY]", body);

// //     const { address, items, paymentMethod } = body;

// //     if (!address || !items || Object.keys(items).length === 0 || !paymentMethod) {
// //       return NextResponse.json(
// //         { success: false, message: "Invalid order data" },
// //         { status: 400 }
// //       );
// //     }

// //     // Convert { productId: qty } into array
// //     const itemsArray = Object.entries(items).map(([product, quantity]) => ({
// //       product,
// //       quantity,
// //     }));

// //     // Validate stock and calculate total
// //     let totalAmount = 0;
// //     for (const item of itemsArray) {
// //       const product = await Product.findById(item.product);
// //       if (!product) {
// //         return NextResponse.json(
// //           { success: false, message: "Product not found" },
// //           { status: 404 }
// //         );
// //       }
// //       if (product.stock < item.quantity) {
// //         return NextResponse.json(
// //           {
// //             success: false,
// //             message: `Insufficient stock for ${product.name}`,
// //           },
// //           { status: 400 }
// //         );
// //       }
// //       totalAmount += product.offerPrice * item.quantity;
// //     }

// //     // Deduct stock
// //     for (const item of itemsArray) {
// //       const product = await Product.findById(item.product);
// //       product.stock -= item.quantity;
// //       await product.save();
// //     }

// //     // ✅ Save Order in DB (same as Stripe flow)
// //     const order = await Order.create({
// //       userId,
// //       address,
// //       items: itemsArray,
// //       amount: totalAmount,
// //       date: Date.now(),
// //       paymentMethod,
// //       status: "Order Placed",
// //     });

// //     // Fire Inngest event (optional: for async stuff like sending emails)
// //     await inngest.send({
// //       name: "order/created",
// //       data: order.toObject(),
// //     });

// //     // Clear cart
// //     const user = await User.findById(userId);
// //     if (user) {
// //       user.cartItems = {};
// //       await user.save();
// //     }

// //     return NextResponse.json({
// //       success: true,
// //       message: "Order created successfully",
// //       order,
// //     });
// //   } catch (error) {
// //     console.error("[ORDER_POST_ERROR]", error);
// //     return NextResponse.json(
// //       { success: false, message: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }












































































// //Both Paystack and Stripe
// import { inngest } from "@/config/inngest";
// import Product from "@/models/Product";
// import User from "@/models/User";
// import Order from "@/models/Order";
// import connectDB from "@/config/db";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const url = new URL(request.url);
//     const source = url.searchParams.get("source") || "client";
//     console.log("[ORDER_CREATE] Source:", source);

//     let userId, address, items, paymentMethod;

//     // 🔹 Stripe webhook flow
//     if (source === "stripe-webhook") {
//       const body = await request.json();
//       console.log("[STRIPE_WEBHOOK_ORDER_BODY]", JSON.stringify(body, null, 2));

//       const session = body.data?.object;
//       if (!session?.metadata) {
//         throw new Error("Stripe metadata missing");
//       }

//       userId = session.metadata.userId;
//       address = JSON.parse(session.metadata.address || "{}");
//       items = JSON.parse(session.metadata.items || "{}");
//       paymentMethod = "Stripe";
//     } 
//     // 🔹 Paystack + client flow
//     else {
//       const { userId: authUserId } = getAuth(request);
//       if (!authUserId) {
//         return NextResponse.json(
//           { success: false, message: "Unauthorized" },
//           { status: 401 }
//         );
//       }

//       const body = await request.json();
//       console.log("[CLIENT_ORDER_BODY]", body);

//       userId = authUserId;
//       address = body.address;
//       items = body.items;
//       paymentMethod = body.paymentMethod || (source === "paystack" ? "Paystack" : "Manual");
//     }

//     // 🔹 Normalize items: convert { productId: qty } → array
//     let itemsArray = [];
//     if (Array.isArray(items)) {
//       itemsArray = items;
//     } else if (items && typeof items === "object") {
//       itemsArray = Object.entries(items).map(([product, quantity]) => ({
//         product,
//         quantity,
//       }));
//     }

//     if (!address || itemsArray.length === 0) {
//       console.error("[ORDER_CREATE_ERROR] Invalid data", { address, items, paymentMethod });
//       return NextResponse.json(
//         { success: false, message: "Invalid order data" },
//         { status: 400 }
//       );
//     }

//     // 🔹 Validate stock + calculate total
//     let totalAmount = 0;
//     for (const item of itemsArray) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         throw new Error(`Product not found: ${item.product}`);
//       }
//       if (product.stock < item.quantity) {
//         throw new Error(`Insufficient stock for ${product.name}`);
//       }
//       totalAmount += (product.offerPrice || product.price) * item.quantity;
//     }

//     // 🔹 Deduct stock
//     for (const item of itemsArray) {
//       const product = await Product.findById(item.product);
//       product.stock -= item.quantity;
//       await product.save();
//     }

//     // 🔹 Save order in DB (Stripe + Paystack both persist)
//     const order = await Order.create({
//       userId,
//       address,
//       items: itemsArray,
//       amount: totalAmount,
//       date: Date.now(),
//       paymentMethod,
//       status: "Order Placed",
//     });

//     console.log("[ORDER_CREATE_SUCCESS] Order ID:", order._id);

//     // 🔹 Fire Inngest event for async handling
//     await inngest.send({ name: "order/created", data: order.toObject() });

//     // 🔹 Clear cart
//     const user = await User.findById(userId);
//     if (user) {
//       user.cartItems = {};
//       await user.save();
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Order created successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("[ORDER_POST_ERROR]", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Unexpected error" },
//       { status: 500 }
//     );
//   }
// }

































































// app/api/order/create/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const source = url.searchParams.get("source") || "client"; // stripe-webhook / paystack-webhook / client
    console.log("[ORDER_CREATE] Source:", source);

    let userId, items, address, paymentMethod, orderId, paymentIntentId, paymentStatus;

    // 🔹 Stripe webhook flow
    if (source === "stripe-webhook") {
      const body = await req.json();
      const session = body.data?.object;
      if (!session?.metadata) throw new Error("Stripe metadata missing");

      // Use Stripe session ID as unique order ID
      orderId = session.id;
      paymentIntentId = session.id;
      userId = session.metadata.userId;
      address = JSON.parse(session.metadata.address || "{}");
      items = JSON.parse(session.metadata.items || "[]");
      paymentMethod = "Stripe";
      paymentStatus = "Successful";

      // Idempotency: skip if order exists
      const existing = await Order.findOne({ orderId });
      if (existing) {
        console.log("[ORDER_CREATE] Stripe order already exists, skipping:", orderId);
        return NextResponse.json({ success: true, message: "Order already exists" });
      }
    }

    // 🔹 Paystack webhook flow
    else if (source === "paystack-webhook") {
      const body = await req.text();
      const event = JSON.parse(body);
      if (event.event !== "charge.success") return NextResponse.json({ received: true });

      let metadata = event.data.metadata || {};
      if (typeof metadata === "string") metadata = JSON.parse(metadata);

      orderId = event.data.reference;
      paymentIntentId = event.data.reference;
      userId = metadata.userId;
      address = typeof metadata.address === "string" ? JSON.parse(metadata.address) : metadata.address;
      items = typeof metadata.items === "string" ? JSON.parse(metadata.items) : metadata.items;
      paymentMethod = "Paystack";
      paymentStatus = "Successful";

      // Idempotency: skip if order exists
      const existing = await Order.findOne({ paymentIntentId });
      if (existing) {
        console.log("[ORDER_CREATE] Paystack order already exists, skipping:", paymentIntentId);
        return NextResponse.json({ success: true, message: "Order already exists" });
      }
    }

    // 🔹 Client-side / manual flow (e.g., initiating payment)
    else {
      const { userId: authUserId } = getAuth(req);
      if (!authUserId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

      const body = await req.json();
      userId = authUserId;
      items = body.items;
      address = body.address;
      paymentMethod = body.paymentMethod || "Manual";
      paymentStatus = "Pending"; // Not paid yet
    }

    // Normalize items: { productId: qty } → array
    const itemsArray = Array.isArray(items)
      ? items
      : Object.entries(items || {}).map(([product, quantity]) => ({ product, quantity }));

    if (!address || itemsArray.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
    }

    // 🔹 Validate stock and calculate total
    let totalAmount = 0;
    for (const item of itemsArray) {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      totalAmount += (product.offerPrice || product.price) * item.quantity;
    }

    // 🔹 Deduct stock (skip if webhook already created order)
    if (!orderId || source === "client") {
      for (const item of itemsArray) {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // 🔹 Create order in DB
    const order = await Order.create({
      orderId: orderId || undefined,
      paymentIntentId: paymentIntentId || undefined,
      userId,
      items: itemsArray,
      address,
      amount: totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: paymentStatus === "Successful" ? "Order Placed" : "Pending",
      date: Date.now(),
    });

    console.log("[ORDER_CREATE_SUCCESS] Order ID:", order._id);

    // 🔹 Clear user cart if payment is successful
    if (paymentStatus === "Successful") {
      await User.findByIdAndUpdate(userId, { cartItems: {} });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[ORDER_CREATE_ERROR]", err);
    return NextResponse.json({ success: false, message: err.message || "Unexpected error" }, { status: 500 });
  }
}
