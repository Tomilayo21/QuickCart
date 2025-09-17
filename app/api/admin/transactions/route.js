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

//     // Count total number of orders (without pagination)
//     const totalCount = await Order.countDocuments();

//     // Fetch paginated results
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     return NextResponse.json({ transactions: orders, totalCount });
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
//     const sevenDaysAgo = new Date(now);
//     sevenDaysAgo.setDate(now.getDate() - 7);

//     const thirtyDaysAgo = new Date(now);
//     thirtyDaysAgo.setDate(now.getDate() - 30);

//     // ✅ Count of transactions
//     const last7DaysCount = await Order.countDocuments({
//       createdAt: { $gte: sevenDaysAgo },
//     });

//     const last30DaysCount = await Order.countDocuments({
//       createdAt: { $gte: thirtyDaysAgo },
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

//     //Total hours ago
//     const oneDayAgo = new Date();
//     oneDayAgo.setDate(now.getDate() - 1);

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

//     // Get daily totals for last 7 days
//     const dailyStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
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

//     // Format to frontend-ready array
//     const dailyTrend = dailyStats.map((entry) => ({
//       date: ${entry._id.day}/${entry._id.month},
//       total: entry.total,
//     }));

//     // Monthly Chart Data (last 30 days grouped by day)
//     const monthlyStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
//         },
//       },
//       // {
//       //   $group: {
//       //     _id: {
//       //       day: { $dayOfMonth: "$createdAt" },
//       //       month: { $month: "$createdAt" },
//       //       year: { $year: "$createdAt" },
//       //     },
//       //     total: { $sum: "$amount" },
//       //   },
//       // },
//       {
//         $group: {
//           _id: {
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

//     const monthlyTrend = monthlyStats.map((entry) => ({
//       // date: ${entry._id.day}/${entry._id.month},
//       date: ${entry._id.month}/${entry._id.year},
//       total: entry.total,
//     }));


//     // ✅ Paginated orders
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     return NextResponse.json(
//       {
//         transactions: orders,
//         totalCount,
//         last7DaysCount,
//         last30DaysCount,
//         totalAmount,
//         last7DaysAmount,
//         last30DaysAmount,
//         last24HoursAmount,
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

//     // ✅ Count of transactions
//     const last7DaysCount = await Order.countDocuments({
//       createdAt: { $gte: sevenDaysAgo },
//     });

//     const last30DaysCount = await Order.countDocuments({
//       createdAt: { $gte: thirtyDaysAgo },
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

//     // ✅ Monthly trend (grouped by month/year)
//     const monthlyStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: thirtyDaysAgo },
//         },
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
//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1,
//         },
//       },
//     ]);

//     const monthlyTrend = monthlyStats.map((entry) => ({
//       date: `${entry._id.month}/${entry._id.year}`,
//       total: entry.total,
//     }));

//     // ✅ Paginated orders
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     return NextResponse.json(
//       {
//         transactions: orders,
//         totalCount,
//         last7DaysCount,
//         last30DaysCount,
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

    // ✅ Start & End of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // ✅ Count of transactions
    const last7DaysCount = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const thisMonthCount = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const totalCount = await Order.countDocuments();

    // ✅ Sum of totalAmount across all orders
    const totalAmountResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalAmount = totalAmountResult[0]?.totalAmount || 0;

    // ✅ Total in last 24 hours
    const last24HoursAmountResult = await Order.aggregate([
      { $match: { createdAt: { $gte: oneDayAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const last24HoursAmount = last24HoursAmountResult[0]?.total || 0;

    // ✅ Total in last 7 days
    const last7DaysAmountResult = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const last7DaysAmount = last7DaysAmountResult[0]?.total || 0;

    // ✅ Total in last 30 days
    const last30DaysAmountResult = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const last30DaysAmount = last30DaysAmountResult[0]?.total || 0;

    // ✅ Today's transactions count
    const todayCount = await Order.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    // ✅ Yesterday's transactions count
    const yesterdayCount = await Order.countDocuments({
      createdAt: {
        $gte: twoDaysAgo,
        $lt: oneDayAgo,
      },
    });

    // ✅ Daily trend for last 7 days
    const dailyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
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
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    const dailyTrend = dailyStats.map((entry) => ({
      date: `${entry._id.day}/${entry._id.month}`,
      total: entry.total,
    }));

    // ✅ Monthly trend (this month only)
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthlyTrend = monthlyStats.map((entry) => ({
      date: `${entry._id.month}/${entry._id.year}`,
      total: entry.total,
    }));

    // ✅ Paginated orders
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
