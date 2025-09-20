// import connectDB from "@/config/db";
// import { getAuth } from "@clerk/nextjs/server";
// import Order from "@/models/Order";
// import Product from "@/models/Product";
// import Address from "@/models/Address";
// import authSeller from "@/lib/authAdmin";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     const { userId } = getAuth(request);
//     const isAdmin = await authSeller(userId);

//     if (!isAdmin) {
//       return NextResponse.json({ success: false, message: "Unauthorized" });
//     }

//     await connectDB();

//     const orders = await Order.find({})
//       .populate("address")
//       .populate("items.product");

//     return NextResponse.json({ success: true, orders });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message });
//   }
// }

















































// import connectDB from "@/config/db";
// import { getAuth } from "@clerk/nextjs/server";
// import Order from "@/models/Order";
// import authSeller from "@/lib/authAdmin";
// import { NextResponse } from "next/server";
// import Address from "@/models/Address";


// export async function GET(request) {
//   try {
//     const { userId } = getAuth(request);
//     const isAdmin = await authSeller(userId);

//     if (!isAdmin) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
//     }

//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const range = parseInt(searchParams.get("range")) || 7; // default 7 days
//     const now = new Date();
//     const fromDate = new Date(now);
//     fromDate.setDate(now.getDate() - range);

//     // --- Orders in range
//     const orders = await Order.find({ createdAt: { $gte: fromDate } })
//       .populate("address")
//       .populate("items.product");

//     // --- Aggregates
//     const totalOrders = orders.length;
//     const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

//     // Daily Orders
//     const dailyOrders = await Order.aggregate([
//       { $match: { createdAt: { $gte: fromDate } } },
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: "$createdAt" },
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" },
//           },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     ]).then((res) =>
//       res.map((d) => ({
//         date: `${d._id.year}-${String(d._id.month).padStart(2, "0")}-${String(
//           d._id.day
//         ).padStart(2, "0")}`,
//         count: d.count,
//       }))
//     );

//     // Daily Revenue
//     const dailyRevenue = await Order.aggregate([
//       { $match: { createdAt: { $gte: fromDate } } },
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: "$createdAt" },
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" },
//           },
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     ]).then((res) =>
//       res.map((d) => ({
//         date: `${d._id.year}-${String(d._id.month).padStart(2, "0")}-${String(
//           d._id.day
//         ).padStart(2, "0")}`,
//         total: d.total,
//       }))
//     );

//     return NextResponse.json({
//       success: true,
//       totalOrders,
//       totalRevenue,
//       dailyOrders,
//       dailyRevenue,
//       orders,
//     });
//   } catch (error) {
//     console.error("Admin Orders API Error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

























// import connectDB from "@/config/db";
// import { getAuth } from "@clerk/nextjs/server";
// import Order from "@/models/Order";
// import Address from "@/models/Address";
// import authSeller from "@/lib/authAdmin";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     const { userId } = getAuth(request);
//     const isAdmin = await authSeller(userId);

//     if (!isAdmin) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const range = parseInt(searchParams.get("range")) || 7; // default: last 7 days
//     const now = new Date();
//     const fromDate = new Date(now);
//     fromDate.setDate(now.getDate() - range);

//     // --- Recent Orders (always latest 5, no matter the range)
//     const recentOrders = await Order.find({})
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("address")
//       .populate("items.product");

//     // --- Orders within range (for analytics)
//     const ordersInRange = await Order.find({ createdAt: { $gte: fromDate } });

//     // --- Aggregates
//     const totalOrders = ordersInRange.length;
//     const totalRevenue = ordersInRange.reduce(
//       (sum, o) => sum + (o.amount || 0),
//       0
//     );

//     // --- Daily Orders
//     const dailyOrders = await Order.aggregate([
//       { $match: { createdAt: { $gte: fromDate } } },
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: "$createdAt" },
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" },
//           },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     ]).then((res) =>
//       res.map((d) => ({
//         date: `${d._id.year}-${String(d._id.month).padStart(
//           2,
//           "0"
//         )}-${String(d._id.day).padStart(2, "0")}`,
//         count: d.count,
//       }))
//     );

//     // --- Daily Revenue
//     const dailyRevenue = await Order.aggregate([
//       { $match: { createdAt: { $gte: fromDate } } },
//       {
//         $group: {
//           _id: {
//             day: { $dayOfMonth: "$createdAt" },
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" },
//           },
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     ]).then((res) =>
//       res.map((d) => ({
//         date: `${d._id.year}-${String(d._id.month).padStart(
//           2,
//           "0"
//         )}-${String(d._id.day).padStart(2, "0")}`,
//         total: d.total,
//       }))
//     );

//     return NextResponse.json({
//       success: true,
//       totalOrders,
//       totalRevenue,
//       dailyOrders,
//       dailyRevenue,
//       orders: recentOrders, // ✅ Always latest 5 orders
//     });
//   } catch (error) {
//     console.error("Admin Orders API Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }












































































import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get("range") || "7"); // default 7 days
    const now = new Date();
    const fromDate = new Date(now);
    fromDate.setDate(now.getDate() - range);

    // --- Recent Orders (always latest 5)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("address")
      .populate("items.product");

    // --- Orders within range
    const ordersInRange = await Order.find({ createdAt: { $gte: fromDate } });

    // --- Aggregates
    const totalOrders = ordersInRange.length;
    const totalRevenue = ordersInRange.reduce(
      (sum, o) => sum + (o.amount || 0),
      0
    );

    // --- Daily Orders
    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]).then((res) =>
      res.map((d) => ({
        date: `${d._id.year}-${String(d._id.month).padStart(
          2,
          "0"
        )}-${String(d._id.day).padStart(2, "0")}`,
        count: d.count,
      }))
    );

    // --- Daily Revenue
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]).then((res) =>
      res.map((d) => ({
        date: `${d._id.year}-${String(d._id.month).padStart(
          2,
          "0"
        )}-${String(d._id.day).padStart(2, "0")}`,
        total: d.total,
      }))
    );

    return NextResponse.json({
      success: true,
      totalOrders,
      totalRevenue,
      dailyOrders,
      dailyRevenue,
      orders: recentOrders,
    });
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}








































































// // app/api/orders/route.ts
// import connectDB from "@/config/db";
// import { getAuth } from "@clerk/nextjs/server";
// import Order from "@/models/Order";
// import authSeller from "@/lib/authAdmin";
// import { NextResponse } from "next/server";
// import { logActivity } from "@/utils/logActivity";

// // ✅ GET: Analytics + recent orders
// export async function GET(request) {
//   try {
//     const { userId } = getAuth(request);
//     const isAdmin = await authSeller(userId);

//     if (!isAdmin) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const range = parseInt(searchParams.get("range") || "7"); // default: 7 days
//     const now = new Date();
//     const fromDate = new Date(now);
//     fromDate.setDate(now.getDate() - range);

//     // --- Recent Orders
//     const recentOrders = await Order.find({})
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("address")
//       .populate("items.product");

//     // --- Orders in range
//     const ordersInRange = await Order.find({ createdAt: { $gte: fromDate } });

//     const totalOrders = ordersInRange.length;
//     const totalRevenue = ordersInRange.reduce(
//       (sum, o) => sum + (o.amount || 0),
//       0
//     );

//     return NextResponse.json({
//       success: true,
//       totalOrders,
//       totalRevenue,
//       orders: recentOrders,
//     });
//   } catch (error) {
//     console.error("Admin Orders API Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // ✅ POST: Create order
// export async function POST(req) {
//   try {
//     await connectDB();
//     const { userId, items, address, amount, paymentMethod } = await req.json();

//     if (!userId || !items || !amount) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const order = await Order.create({
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod,
//       status: "pending",
//     });

//     await logActivity({
//       type: "order",
//       action: "Created",
//       entityId: order._id.toString(),
//       userId,
//       changes: order,
//     });

//     return NextResponse.json({ success: true, order });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message || "Failed to create order" },
//       { status: 500 }
//     );
//   }
// }

// // ✅ PATCH: Update order
// export async function PATCH(req) {
//   try {
//     await connectDB();
//     const { orderId, updates, userId } = await req.json();

//     if (!orderId || !updates) {
//       return NextResponse.json(
//         { error: "Missing orderId or updates" },
//         { status: 400 }
//       );
//     }

//     const order = await Order.findByIdAndUpdate(orderId, updates, { new: true });
//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     await logActivity({
//       type: "order",
//       action: "Updated",
//       entityId: order._id.toString(),
//       userId,
//       changes: order,
//     });

//     return NextResponse.json({ success: true, order });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message || "Failed to update order" },
//       { status: 500 }
//     );
//   }
// }

// // ✅ DELETE: Cancel/Delete order
// export async function DELETE(req) {
//   try {
//     await connectDB();
//     const { orderId, userId } = await req.json();

//     if (!orderId) {
//       return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
//     }

//     const order = await Order.findByIdAndDelete(orderId);
//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     await logActivity({
//       type: "order",
//       action: "Deleted",
//       entityId: order._id.toString(),
//       userId,
//       changes: order,
//     });

//     return NextResponse.json({ success: true, order });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message || "Failed to delete order" },
//       { status: 500 }
//     );
//   }
// }
