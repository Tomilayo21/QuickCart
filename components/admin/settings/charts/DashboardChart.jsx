"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import moment from "moment";
import { useAppContext } from "@/context/AppContext"; // 👈 import your context

export default function DashboardChart({ dailyTrend = [], monthlyTrend = [] }) {
  const [view, setView] = useState("daily");
  const { currency } = useAppContext(); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Format trends
  const formattedDaily = Array.isArray(dailyTrend)
    ? dailyTrend.map((entry) => ({
        date: entry.date,
        total: typeof entry.total === "number" ? entry.total : 0,
      }))
    : [];

  // Ensure this week (Monday–Sunday)
  const startOfWeek = moment().startOf("isoWeek"); // Monday
  const endOfWeek = moment().endOf("isoWeek");     // Sunday
  const thisWeekDays = [];

  for (let d = startOfWeek.clone(); d.isSameOrBefore(endOfWeek); d.add(1, "day")) {
    const found = formattedDaily.find((f) => moment(f.date).isSame(d, "day"));
    thisWeekDays.push({
      date: d.toISOString(),
      total: found ? found.total : 0,
    });
  }

  const formattedMonthly = Array.isArray(monthlyTrend)
    ? monthlyTrend.map((entry) => ({
        date: entry.date,
        total: typeof entry.total === "number" ? entry.total : 0,
      }))
    : [];

  // Pick data based on view
  const data = view === "daily" ? thisWeekDays : formattedMonthly;


  // Split past/today vs future
  const today = moment().endOf("day");
  const pastData = data.filter((d) => moment(d.date).isSameOrBefore(today));
  const futureData = data.filter((d) => moment(d.date).isAfter(today));

  // tick formatter
  const formatTick = (isoDate) => {
    if (!isoDate) return "";
    return isMobile
      ? moment(isoDate).format("ddd") // 👈 Mon, Tue, Wed
      : view === "daily"
      ? moment(isoDate).format("ddd, MMM D")
      : moment(isoDate).format("MMM D");
  };
  
  // tooltip label
  const formatLabel = (isoDate) =>
    view === "daily"
      ? `Day: ${moment(isoDate).format("ddd, MMM D")}`
      : `Day: ${moment(isoDate).format("MMM D")}`;

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Deposit Trend —{" "}
          <span className="text-orange-600">
            {view === "daily" ? "This Week" : "This Month"}
          </span>
        </h2>

        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              view === "daily"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setView("daily")}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              view === "monthly"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setView("monthly")}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              type="category"
              allowDuplicatedCategory={false}
              tickFormatter={formatTick}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />          
            <YAxis
              tickFormatter={(value) =>
                `${currency}${Number(value).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}`
              }
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value) =>
                `${currency}${Number(value).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}`
              }
              labelFormatter={(label) => formatLabel(label)}
            />

            {/* Past/today line (solid) */}
            <Line
              data={pastData}
              type="monotone"
              dataKey="total"
              stroke="#6B7280"
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#6B7280" }}
              activeDot={{
                r: 7,
                strokeWidth: 2,
                stroke: "#6B7280",
                fill: "#fff",
              }}
              animationDuration={800}
            />

            {/* Future line (dashed, lighter) */}
            <Line
              data={futureData}
              type="monotone"
              dataKey="total"
              stroke="#9CA3AF"
              strokeWidth={3}
              strokeDasharray="6 6"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
