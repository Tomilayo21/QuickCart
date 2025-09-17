// import { NextResponse } from "next/server";
// import Order from "@/models/Order";
// import connectDB from "@/config/db";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     const now = new Date();
//     const oneDayAgo = new Date(now);
//     oneDayAgo.setDate(now.getDate() - 1);

//     const twoDaysAgo = new Date(now);
//     twoDaysAgo.setDate(now.getDate() - 2);

//     const sevenDaysAgo = new Date(now);
//     sevenDaysAgo.setDate(now.getDate() - 7);

//     const thirtyDaysAgo = new Date(now);
//     thirtyDaysAgo.setDate(now.getDate() - 30);

//     // ✅ Start & End of current month
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

//     // ✅ Count of transactions
//     const last7DaysCount = await Order.countDocuments({
//       createdAt: { $gte: sevenDaysAgo },
//     });

//     const thisMonthCount = await Order.countDocuments({
//       createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//     });

//     const totalCount = await Order.countDocuments();

//     // ✅ Sum of totalAmount across all orders
//     const totalAmountResult = await Order.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$amount" },
//         },
//       },
//     ]);
//     const totalAmount = totalAmountResult[0]?.totalAmount || 0;

//     // ✅ Total in last 24 hours
//     const last24HoursAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: oneDayAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last24HoursAmount = last24HoursAmountResult[0]?.total || 0;

//     // ✅ Total in last 7 days
//     const last7DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: sevenDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last7DaysAmount = last7DaysAmountResult[0]?.total || 0;

//     // ✅ Total in last 30 days
//     const last30DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: thirtyDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last30DaysAmount = last30DaysAmountResult[0]?.total || 0;

//     // ✅ Today's transactions count
//     const todayCount = await Order.countDocuments({
//       createdAt: { $gte: oneDayAgo },
//     });

//     // ✅ Yesterday's transactions count
//     const yesterdayCount = await Order.countDocuments({
//       createdAt: {
//         $gte: twoDaysAgo,
//         $lt: oneDayAgo,
//       },
//     });

//     // ✅ Daily trend for last 7 days
//     const dailyStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: sevenDaysAgo },
//         },
//       },
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
//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1,
//           "_id.day": 1,
//         },
//       },
//     ]);

//     const dailyTrend = dailyStats.map((entry) => ({
//       date: `${entry._id.day}/${entry._id.month}`,
//       total: entry.total,
//     }));

//     // ✅ Monthly trend (this month only)
//     // const monthlyStats = await Order.aggregate([
//     //   {
//     //     $match: {
//     //       createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//     //     },
//     //   },
//     //   {
//     //     $group: {
//     //       _id: {
//     //         month: { $month: "$createdAt" },
//     //         year: { $year: "$createdAt" },
//     //       },
//     //       total: { $sum: "$amount" },
//     //     },
//     //   },
//     //   {
//     //     $sort: {
//     //       "_id.year": 1,
//     //       "_id.month": 1,
//     //     },
//     //   },
//     // ]);

// // ✅ Monthly trend (group by each day in this month)
// const monthlyStats = await Order.aggregate([
//   {
//     $match: {
//       createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//     },
//   },
//   {
//     $group: {
//       _id: {
//         day: { $dayOfMonth: "$createdAt" },
//         month: { $month: "$createdAt" },
//         year: { $year: "$createdAt" },
//       },
//       total: { $sum: "$amount" },
//     },
//   },
//   {
//     $sort: {
//       "_id.year": 1,
//       "_id.month": 1,
//       "_id.day": 1,
//     },
//   },
// ]);

// const monthlyTrend = monthlyStats.map((entry) => ({
//   date: `${entry._id.day}/${entry._id.month}/${entry._id.year}`, // e.g. "15/9/2025"
//   total: entry.total,
// }));






//     // ✅ Paginated orders
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("userId", "username email")
//       .lean();

//     return NextResponse.json(
//       {
//         transactions: orders,
//         totalCount,
//         last7DaysCount,
//         thisMonthCount,
//         totalAmount,
//         last7DaysAmount,
//         last30DaysAmount,
//         last24HoursAmount,
//         todayCount,
//         yesterdayCount,
//         dailyTrend,
//         monthlyTrend,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to fetch orders:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }








































// import { NextResponse } from "next/server";
// import Order from "@/models/Order";
// import connectDB from "@/config/db";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     const now = new Date();
//     const oneDayAgo = new Date(now);
//     oneDayAgo.setDate(now.getDate() - 1);

//     const twoDaysAgo = new Date(now);
//     twoDaysAgo.setDate(now.getDate() - 2);

//     const sevenDaysAgo = new Date(now);
//     sevenDaysAgo.setDate(now.getDate() - 7);

//     const thirtyDaysAgo = new Date(now);
//     thirtyDaysAgo.setDate(now.getDate() - 30);

//     // Start & end of current month
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

//     // Counts & totals (unchanged)
//     const last7DaysCount = await Order.countDocuments({
//       createdAt: { $gte: sevenDaysAgo },
//     });

//     const thisMonthCount = await Order.countDocuments({
//       createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//     });

//     const totalCount = await Order.countDocuments();

//     const totalAmountResult = await Order.aggregate([
//       { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
//     ]);
//     const totalAmount = totalAmountResult[0]?.totalAmount || 0;

//     const last24HoursAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: oneDayAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last24HoursAmount = last24HoursAmountResult[0]?.total || 0;

//     const last7DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: sevenDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last7DaysAmount = last7DaysAmountResult[0]?.total || 0;

//     const last30DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: thirtyDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last30DaysAmount = last30DaysAmountResult[0]?.total || 0;

//     const todayCount = await Order.countDocuments({
//       createdAt: { $gte: oneDayAgo },
//     });

//     const yesterdayCount = await Order.countDocuments({
//       createdAt: { $gte: twoDaysAgo, $lt: oneDayAgo },
//     });

//     // Daily trend for last 7 days (group by day)
//     const dailyStats = await Order.aggregate([
//       { $match: { createdAt: { $gte: sevenDaysAgo } } },
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
//     ]);

//     // monthlyStats: day-by-day for current month
//     const monthlyStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//         },
//       },
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
//     ]);

//     // Helper to format ISO YYYY-MM-DD
//     const pad = (n) => String(n).padStart(2, "0");

//     const dailyTrend = dailyStats.map((entry) => {
//       const y = entry._id.year;
//       const m = pad(entry._id.month);
//       const d = pad(entry._id.day);
//       return {
//         date: `${y}-${m}-${d}`, // ISO: YYYY-MM-DD
//         total: entry.total,
//       };
//     });

//     const monthlyTrend = monthlyStats.map((entry) => {
//       const y = entry._id.year;
//       const m = pad(entry._id.month);
//       const d = pad(entry._id.day);
//       return {
//         date: `${y}-${m}-${d}`, // ISO: YYYY-MM-DD (day-by-day)
//         total: entry.total,
//       };
//     });

//     // Paginated orders (unchanged)
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("userId", "username email")
//       .lean();

//     return NextResponse.json(
//       {
//         transactions: orders,
//         totalCount,
//         last7DaysCount,
//         thisMonthCount,
//         totalAmount,
//         last7DaysAmount,
//         last30DaysAmount,
//         last24HoursAmount,
//         todayCount,
//         yesterdayCount,
//         dailyTrend,
//         monthlyTrend,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to fetch orders:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }













































// import { NextResponse } from "next/server";
// import Order from "@/models/Order";
// import connectDB from "@/config/db";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     const now = new Date();
//     const oneDayAgo = new Date(now);
//     oneDayAgo.setDate(now.getDate() - 1);

//     const twoDaysAgo = new Date(now);
//     twoDaysAgo.setDate(now.getDate() - 2);

//     const sevenDaysAgo = new Date(now);
//     sevenDaysAgo.setDate(now.getDate() - 7);

//     const thirtyDaysAgo = new Date(now);
//     thirtyDaysAgo.setDate(now.getDate() - 30);

//     // ✅ Last 12 months range
//     const twelveMonthsAgo = new Date(now);
//     twelveMonthsAgo.setMonth(now.getMonth() - 11);

//     // --- COUNTS & TOTALS ---
//     const last7DaysCount = await Order.countDocuments({
//       createdAt: { $gte: sevenDaysAgo },
//     });

//     const thisMonthCount = await Order.countDocuments({
//       createdAt: {
//         $gte: new Date(now.getFullYear(), now.getMonth(), 1),
//         $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
//       },
//     });

//     const totalCount = await Order.countDocuments();

//     const totalAmountResult = await Order.aggregate([
//       { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
//     ]);
//     const totalAmount = totalAmountResult[0]?.totalAmount || 0;

//     const last24HoursAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: oneDayAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last24HoursAmount = last24HoursAmountResult[0]?.total || 0;

//     const last7DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: sevenDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last7DaysAmount = last7DaysAmountResult[0]?.total || 0;

//     const last30DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: thirtyDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last30DaysAmount = last30DaysAmountResult[0]?.total || 0;

//     const todayCount = await Order.countDocuments({
//       createdAt: { $gte: oneDayAgo },
//     });

//     const yesterdayCount = await Order.countDocuments({
//       createdAt: { $gte: twoDaysAgo, $lt: oneDayAgo },
//     });

//     // --- TRENDS ---

//     // ✅ Daily trend: last 7 days grouped by day
//     const dailyStats = await Order.aggregate([
//       { $match: { createdAt: { $gte: sevenDaysAgo } } },
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
//     ]);

//     // ✅ Monthly trend: last 12 months grouped by month
//     const monthlyStats = await Order.aggregate([
//       {
//         $match: { createdAt: { $gte: twelveMonthsAgo, $lte: now } },
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" },
//           },
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//     ]);

//     // Helper for padded numbers
//     const pad = (n) => String(n).padStart(2, "0");

//     const dailyTrend = dailyStats.map((entry) => {
//       const y = entry._id.year;
//       const m = pad(entry._id.month);
//       const d = pad(entry._id.day);
//       return {
//         date: `${y}-${m}-${d}`, // ISO format: YYYY-MM-DD
//         total: entry.total,
//       };
//     });

//     const monthlyTrend = monthlyStats.map((entry) => {
//       const y = entry._id.year;
//       const m = pad(entry._id.month);
//       return {
//         date: `${y}-${m}-01`, // Use first of month
//         total: entry.total,
//       };
//     });

//     // --- PAGINATED ORDERS ---
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("userId", "username email")
//       .lean();

//     return NextResponse.json(
//       {
//         transactions: orders,
//         totalCount,
//         last7DaysCount,
//         thisMonthCount,
//         totalAmount,
//         last7DaysAmount,
//         last30DaysAmount,
//         last24HoursAmount,
//         todayCount,
//         yesterdayCount,
//         dailyTrend,
//         monthlyTrend,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to fetch orders:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }

























// import { NextResponse } from "next/server";
// import Order from "@/models/Order";
// import connectDB from "@/config/db";

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     const now = new Date();

//     const oneDayAgo = new Date(now);
//     oneDayAgo.setDate(now.getDate() - 1);

//     const twoDaysAgo = new Date(now);
//     twoDaysAgo.setDate(now.getDate() - 2);

//     const sevenDaysAgo = new Date(now);
//     sevenDaysAgo.setDate(now.getDate() - 7);

//     const thirtyDaysAgo = new Date(now);
//     thirtyDaysAgo.setDate(now.getDate() - 30);

//     // Start & end of current month
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of this month

//     // Counts & totals
//     const last7DaysCount = await Order.countDocuments({
//       createdAt: { $gte: sevenDaysAgo },
//     });

//     const thisMonthCount = await Order.countDocuments({
//       createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//     });

//     const totalCount = await Order.countDocuments();

//     const totalAmountResult = await Order.aggregate([
//       { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
//     ]);
//     const totalAmount = totalAmountResult[0]?.totalAmount || 0;

//     const last24HoursAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: oneDayAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last24HoursAmount = last24HoursAmountResult[0]?.total || 0;

//     const last7DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: sevenDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last7DaysAmount = last7DaysAmountResult[0]?.total || 0;

//     const last30DaysAmountResult = await Order.aggregate([
//       { $match: { createdAt: { $gte: thirtyDaysAgo } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const last30DaysAmount = last30DaysAmountResult[0]?.total || 0;

//     const todayCount = await Order.countDocuments({
//       createdAt: { $gte: oneDayAgo },
//     });

//     const yesterdayCount = await Order.countDocuments({
//       createdAt: { $gte: twoDaysAgo, $lt: oneDayAgo },
//     });

//     // Daily trend for last 7 days
//     const dailyStats = await Order.aggregate([
//       { $match: { createdAt: { $gte: sevenDaysAgo } } },
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
//     ]);

//     // Monthly stats: group by day
//     const monthlyStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//         },
//       },
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
//     ]);

//     const pad = (n) => String(n).padStart(2, "0");

//     // Build map for monthly stats
//     const monthlyMap = new Map(
//       monthlyStats.map((entry) => {
//         const y = entry._id.year;
//         const m = pad(entry._id.month);
//         const d = pad(entry._id.day);
//         return [`${y}-${m}-${d}`, entry.total];
//       })
//     );

//     // Fill missing days in current month
//     const monthlyTrend = [];
//     for (
//       let d = new Date(startOfMonth);
//       d <= endOfMonth;
//       d.setDate(d.getDate() + 1)
//     ) {
//       const y = d.getFullYear();
//       const m = pad(d.getMonth() + 1);
//       const day = pad(d.getDate());
//       const key = `${y}-${m}-${day}`;
//       monthlyTrend.push({
//         date: key,
//         total: monthlyMap.get(key) || 0,
//       });
//     }

//     // Daily trend format
//     const dailyTrend = dailyStats.map((entry) => {
//       const y = entry._id.year;
//       const m = pad(entry._id.month);
//       const d = pad(entry._id.day);
//       return {
//         date: `${y}-${m}-${d}`,
//         total: entry.total,
//       };
//     });

//     // Paginated orders
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("userId", "username email")
//       .lean();

//     return NextResponse.json(
//       {
//         transactions: orders,
//         totalCount,
//         last7DaysCount,
//         thisMonthCount,
//         totalAmount,
//         last7DaysAmount,
//         last30DaysAmount,
//         last24HoursAmount,
//         todayCount,
//         yesterdayCount,
//         dailyTrend,
//         monthlyTrend,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to fetch orders:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }



























import { NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/config/db";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const now = new Date();

    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Start & end of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of this month

    // Counts & totals
    const last7DaysCount = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const thisMonthCount = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const totalCount = await Order.countDocuments();

    const totalAmountResult = await Order.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalAmount = totalAmountResult[0]?.totalAmount || 0;

    const last24HoursAmountResult = await Order.aggregate([
      { $match: { createdAt: { $gte: oneDayAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const last24HoursAmount = last24HoursAmountResult[0]?.total || 0;

    const last7DaysAmountResult = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const last7DaysAmount = last7DaysAmountResult[0]?.total || 0;

    const last30DaysAmountResult = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const last30DaysAmount = last30DaysAmountResult[0]?.total || 0;

    const todayCount = await Order.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    const yesterdayCount = await Order.countDocuments({
      createdAt: { $gte: twoDaysAgo, $lt: oneDayAgo },
    });

    // Daily trend for last 7 days
    const dailyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
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
    ]);

    // Monthly stats: group by day
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
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
    ]);

    const pad = (n) => String(n).padStart(2, "0");

    // Build map for monthly stats
    const monthlyMap = new Map(
      monthlyStats.map((entry) => {
        const y = entry._id.year;
        const m = pad(entry._id.month);
        const d = pad(entry._id.day);
        return [`${y}-${m}-${d}`, entry.total];
      })
    );

    // Fill missing days in current month (forecast-style)
    const monthlyTrend = [];
    for (
      let d = new Date(startOfMonth);
      d <= endOfMonth;
      d.setDate(d.getDate() + 1)
    ) {
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const key = `${y}-${m}-${day}`;
      monthlyTrend.push({
        date: key,
        total: monthlyMap.get(key) || 0, // 0 for missing (future days too)
      });
    }

    // Daily trend format
    const dailyTrend = dailyStats.map((entry) => {
      const y = entry._id.year;
      const m = pad(entry._id.month);
      const d = pad(entry._id.day);
      return {
        date: `${y}-${m}-${d}`,
        total: entry.total,
      };
    });

    // Paginated orders
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "username email")
      .lean();

    return NextResponse.json(
      {
        transactions: orders,
        totalCount,
        last7DaysCount,
        thisMonthCount,
        totalAmount,
        last7DaysAmount,
        last30DaysAmount,
        last24HoursAmount,
        todayCount,
        yesterdayCount,
        dailyTrend,
        monthlyTrend,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
