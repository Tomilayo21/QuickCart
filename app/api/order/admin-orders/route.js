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

























import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import Order from "@/models/Order";
import Address from "@/models/Address";
import authSeller from "@/lib/authAdmin";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get("range")) || 7; // default: last 7 days
    const now = new Date();
    const fromDate = new Date(now);
    fromDate.setDate(now.getDate() - range);

    // --- Recent Orders (always latest 5, no matter the range)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("address")
      .populate("items.product");

    // --- Orders within range (for analytics)
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
      orders: recentOrders, // ✅ Always latest 5 orders
    });
  } catch (error) {
    console.error("Admin Orders API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
