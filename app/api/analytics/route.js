

import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import VisitorLog from "@/models/VisitorLog";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = parseInt(searchParams.get("range") || "7", 10);

    // Date range (UTC safe)
    const sinceDate = startOfDay(subDays(new Date(), range - 1));
    const untilDate = endOfDay(new Date());

    // Totals
    const totalPageViews = await VisitorLog.countDocuments({ event: "page_view" });
    const totalVisitors = await VisitorLog.distinct("ip");
    const totalClicks = await VisitorLog.countDocuments({ event: "button_click" });

    // Top pages
    const topPages = await VisitorLog.aggregate([
      { $match: { event: "page_view" } },
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
    ]);

    // Daily views
    const rawDailyViews = await VisitorLog.aggregate([
      {
        $match: {
          event: "page_view",
          createdAt: { $gte: sinceDate, $lte: untilDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Daily clicks
    const rawDailyClicks = await VisitorLog.aggregate([
      {
        $match: {
          event: "button_click",
          createdAt: { $gte: sinceDate, $lte: untilDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days
    const dailyViews = [];
    const dailyClicks = [];

    for (let i = 0; i < range; i++) {
      const d = subDays(untilDate, range - 1 - i);
      const iso = format(d, "yyyy-MM-dd");

      const foundView = rawDailyViews.find((v) => v._id === iso);
      const foundClick = rawDailyClicks.find((c) => c._id === iso);

      const label = format(d, "MMM d"); // e.g. Sep 16

      dailyViews.push({
        date: label,
        count: foundView ? foundView.count : 0,
      });

      dailyClicks.push({
        date: label,
        count: foundClick ? foundClick.count : 0,
      });
    }

    return NextResponse.json({
      totalPageViews,
      totalVisitors: totalVisitors.length,
      totalClicks,
      dailyViews,
      dailyClicks,
      topPages,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
