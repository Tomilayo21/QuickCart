// "use client";

// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import moment from "moment";
// import { useAppContext } from "@/context/AppContext"; // 👈 import your context

// export default function DashboardChart({ dailyTrend = [], monthlyTrend = [] }) {
//   const [view, setView] = useState("daily");
//   const { currency } = useAppContext(); 
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   // Format trends
//   const formattedDaily = Array.isArray(dailyTrend)
//     ? dailyTrend.map((entry) => ({
//         date: entry.date,
//         total: typeof entry.total === "number" ? entry.total : 0,
//       }))
//     : [];

//   // Ensure this week (Monday–Sunday)
//   const startOfWeek = moment().startOf("isoWeek"); // Monday
//   const endOfWeek = moment().endOf("isoWeek");     // Sunday
//   const thisWeekDays = [];

//   for (let d = startOfWeek.clone(); d.isSameOrBefore(endOfWeek); d.add(1, "day")) {
//     const found = formattedDaily.find((f) => moment(f.date).isSame(d, "day"));
//     thisWeekDays.push({
//       date: d.toISOString(),
//       total: found ? found.total : 0,
//     });
//   }

//   const formattedMonthly = Array.isArray(monthlyTrend)
//     ? monthlyTrend.map((entry) => ({
//         date: entry.date,
//         total: typeof entry.total === "number" ? entry.total : 0,
//       }))
//     : [];

//   // Pick data based on view
//   const data = view === "daily" ? thisWeekDays : formattedMonthly;


//   // Split past/today vs future
//   const today = moment().endOf("day");
//   const pastData = data.filter((d) => moment(d.date).isSameOrBefore(today));
//   const futureData = data.filter((d) => moment(d.date).isAfter(today));

//   // tick formatter
//   const formatTick = (isoDate) => {
//     if (!isoDate) return "";
//     return isMobile
//       ? moment(isoDate).format("ddd") // 👈 Mon, Tue, Wed
//       : view === "daily"
//       ? moment(isoDate).format("ddd, MMM D")
//       : moment(isoDate).format("MMM D");
//   };
  
//   // tooltip label
//   const formatLabel = (isoDate) =>
//     view === "daily"
//       ? `Day: ${moment(isoDate).format("ddd, MMM D")}`
//       : `Day: ${moment(isoDate).format("MMM D")}`;

//   return (
//     <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
//         {/* <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
//           Deposit Trend —{" "}
//           <span className="text-orange-600">
//             {view === "daily" ? "This Week" : "This Month"}
//           </span>
//         </h2> */}

//         <div className="flex space-x-2">
//           <button
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
//               view === "daily"
//                 ? "bg-orange-600 text-white shadow-sm"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
//               view === "monthly"
//                 ? "bg-orange-600 text-white shadow-sm"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="h-[320px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart>
//             <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//             <XAxis
//               dataKey="date"
//               type="category"
//               allowDuplicatedCategory={false}
//               tickFormatter={formatTick}
//               tick={{ fontSize: 12, fill: "#6B7280" }}
//               axisLine={false}
//               tickLine={false}
//               interval="preserveStartEnd"
//             />          
//             <YAxis
//               tickFormatter={(value) =>
//                 `${currency}${Number(value).toLocaleString(undefined, {
//                   minimumFractionDigits: 0,
//                 })}`
//               }
//               tick={{ fontSize: 12, fill: "#6B7280" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//                 border: "1px solid #E5E7EB",
//                 boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
//               }}
//               formatter={(value) =>
//                 `${currency}${Number(value).toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                 })}`
//               }
//               labelFormatter={(label) => formatLabel(label)}
//             />

//             {/* Past/today line (solid) */}
//             <Line
//               data={pastData}
//               type="monotone"
//               dataKey="total"
//               stroke="#6B7280"
//               strokeWidth={3}
//               dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#6B7280" }}
//               activeDot={{
//                 r: 7,
//                 strokeWidth: 2,
//                 stroke: "#6B7280",
//                 fill: "#fff",
//               }}
//               animationDuration={800}
//             />

//             {/* Future line (dashed, lighter) */}
//             <Line
//               data={futureData}
//               type="monotone"
//               dataKey="total"
//               stroke="#9CA3AF"
//               strokeWidth={3}
//               strokeDasharray="6 6"
//               dot={false}
//               isAnimationActive={false}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }








































// "use client";

// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import moment from "moment";
// import { useAppContext } from "@/context/AppContext";

// export default function DashboardChart({ dailyTrend = [], monthlyTrend = [] }) {
//   const [view, setView] = useState("daily");
//   const { currency } = useAppContext();
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 640);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   // Format trends (ensure numbers)
//   const formatTrend = (trend) =>
//     trend.map((entry) => ({
//       date: entry.date,
//       total: Number(entry.total) || 0,
//       count: Number(entry.count) || 0,
//     }));

//   const formattedDaily = formatTrend(dailyTrend);
//   const formattedMonthly = formatTrend(monthlyTrend);

//   // Ensure this week (Monday–Sunday)
//   const startOfWeek = moment().startOf("isoWeek");
//   const endOfWeek = moment().endOf("isoWeek");
//   const thisWeekDays = [];

//   for (let d = startOfWeek.clone(); d.isSameOrBefore(endOfWeek); d.add(1, "day")) {
//     const found = formattedDaily.find((f) => moment(f.date).isSame(d, "day"));
//     thisWeekDays.push({
//       date: d.toISOString(),
//       total: found ? found.total : 0,
//       count: found ? found.count : 0,
//     });
//   }

//   const data = view === "daily" ? thisWeekDays : formattedMonthly;

//   // Tick formatter
//   const formatTick = (isoDate) => {
//     if (!isoDate) return "";
//     return isMobile
//       ? moment(isoDate).format("ddd")
//       : view === "daily"
//       ? moment(isoDate).format("ddd, MMM D")
//       : moment(isoDate).format("MMM D");
//   };

//   const formatLabel = (isoDate) =>
//     view === "daily"
//       ? `Day: ${moment(isoDate).format("ddd, MMM D")}`
//       : `Day: ${moment(isoDate).format("MMM D")}`;

//   return (
//     <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
//         <div>
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
//             Total Sales Trend —{" "}
//             <span className="text-orange-600">{view === "daily" ? "This Week" : "This Month"}</span>
//           </h2>
//           <p className="text-gray-600 text-sm">
//             Revenue and order counts over the selected period.
//           </p>
//         </div>

//         <div className="flex space-x-2 mt-2 sm:mt-0">
//           <button
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
//               view === "daily" ? "bg-orange-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
//               view === "monthly" ? "bg-orange-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="h-[320px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//             <XAxis
//               dataKey="date"
//               type="category"
//               allowDuplicatedCategory={false}
//               tickFormatter={formatTick}
//               tick={{ fontSize: 12, fill: "#6B7280" }}
//               axisLine={false}
//               tickLine={false}
//               interval="preserveStartEnd"
//             />
//             <YAxis
//               yAxisId="left"
//               tickFormatter={(value) =>
//                 `${currency}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 0 })}`
//               }
//               tick={{ fontSize: 12, fill: "#6B7280" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               tickFormatter={(value) => Number(value).toLocaleString()}
//               tick={{ fontSize: 12, fill: "#6B7280" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//                 border: "1px solid #E5E7EB",
//                 boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
//               }}
//               formatter={(value, name) => {
//                 if (name === "Revenue") return `${currency}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
//                 if (name === "Orders") return Number(value).toLocaleString();
//                 return value;
//               }}
//               labelFormatter={(label) => formatLabel(label)}
//             />

//             {/* Revenue line */}
//             <Line
//               yAxisId="left"
//               dataKey="total"
//               name="Revenue"
//               type="monotone"
//               stroke="#FF5733"
//               strokeWidth={2}
//               dot={{ r: 3 }}
//               activeDot={{ r: 5 }}
//             />

//             {/* Orders line */}
//             <Line
//               yAxisId="right"
//               dataKey="count"
//               name="Orders"
//               type="monotone"
//               stroke="#1E90FF"
//               strokeWidth={2}
//               dot={{ r: 3 }}
//               activeDot={{ r: 5 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

















































// "use client";

// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import moment from "moment";
// import { useAppContext } from "@/context/AppContext";

// export default function DashboardChart({
//   dailyTrend = [],
//   monthlyTrend = [],
//   orders = [], // 👈 passed from parent
// }) {
//   const [view, setView] = useState("daily");
//   const { currency } = useAppContext();
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   // Format daily data
//   const formattedDaily = Array.isArray(dailyTrend)
//     ? dailyTrend.map((entry) => ({
//         date: entry.date,
//         total: typeof entry.total === "number" ? entry.total : 0,
//       }))
//     : [];

//   // Ensure this week (Monday–Sunday)
//   const startOfWeek = moment().startOf("isoWeek");
//   const endOfWeek = moment().endOf("isoWeek");
//   const thisWeekDays = [];

//   for (let d = startOfWeek.clone(); d.isSameOrBefore(endOfWeek); d.add(1, "day")) {
//     const found = formattedDaily.find((f) => moment(f.date).isSame(d, "day"));
//     thisWeekDays.push({
//       date: d.toISOString(),
//       total: found ? found.total : 0,
//     });
//   }

//   // Format monthly
//   const formattedMonthly = Array.isArray(monthlyTrend)
//     ? monthlyTrend.map((entry) => ({
//         date: entry.date,
//         total: typeof entry.total === "number" ? entry.total : 0,
//       }))
//     : [];

//   // Pick data based on view
//   const data = view === "daily" ? thisWeekDays : formattedMonthly;

//   // Split past/today vs future
//   const today = moment().endOf("day");
//   const pastData = data.filter((d) => moment(d.date).isSameOrBefore(today));
//   const futureData = data.filter((d) => moment(d.date).isAfter(today));

//   // Calculate totals
//   const totalRevenue = data.reduce((sum, entry) => sum + entry.total, 0);
//   const totalOrders = Array.isArray(orders) ? orders.length : 0;

//   // tick formatter
//   const formatTick = (isoDate) => {
//     if (!isoDate) return "";
//     return isMobile
//       ? moment(isoDate).format("ddd")
//       : view === "daily"
//       ? moment(isoDate).format("ddd, MMM D")
//       : moment(isoDate).format("MMM D");
//   };

//   // tooltip label
//   const formatLabel = (isoDate) =>
//     view === "daily"
//       ? `Day: ${moment(isoDate).format("ddd, MMM D")}`
//       : `Day: ${moment(isoDate).format("MMM D")}`;

//   return (
//     <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
//           Total Sales Trend —{" "}
//           <span className="text-orange-600">
//             {view === "daily" ? "This Week" : "This Month"}
//           </span>
//         </h2>

//         <div className="flex flex-col sm:flex-row gap-2 text-sm sm:text-base text-gray-600">
//           <span>
//             Revenue:{" "}
//             <span className="font-semibold text-gray-900">
//               {currency}
//               {totalRevenue.toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//               })}
//             </span>
//           </span>
//           <span className="sm:ml-4">
//             Orders:{" "}
//             <span className="font-semibold text-gray-900">{totalOrders}</span>
//           </span>
//         </div>

//         {/* Toggle buttons */}
//         <div className="flex space-x-2 mt-3 sm:mt-0">
//           <button
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
//               view === "daily"
//                 ? "bg-orange-600 text-white shadow-sm"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             onClick={() => setView("daily")}
//           >
//             This Week
//           </button>
//           <button
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
//               view === "monthly"
//                 ? "bg-orange-600 text-white shadow-sm"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             onClick={() => setView("monthly")}
//           >
//             This Month
//           </button>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="h-[320px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart>
//             <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//             <XAxis
//               dataKey="date"
//               type="category"
//               allowDuplicatedCategory={false}
//               tickFormatter={formatTick}
//               tick={{ fontSize: 12, fill: "#6B7280" }}
//               axisLine={false}
//               tickLine={false}
//               interval="preserveStartEnd"
//             />
//             <YAxis
//               tickFormatter={(value) =>
//                 `${currency}${Number(value).toLocaleString(undefined, {
//                   minimumFractionDigits: 0,
//                 })}`
//               }
//               tick={{ fontSize: 12, fill: "#6B7280" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "white",
//                 borderRadius: "8px",
//                 border: "1px solid #E5E7EB",
//                 boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
//               }}
//               formatter={(value) =>
//                 `${currency}${Number(value).toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                 })}`
//               }
//               labelFormatter={(label) => formatLabel(label)}
//             />

//             {/* Past/today line */}
//             <Line
//               data={pastData}
//               type="monotone"
//               dataKey="total"
//               stroke="#6B7280"
//               strokeWidth={3}
//               dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#6B7280" }}
//               activeDot={{
//                 r: 7,
//                 strokeWidth: 2,
//                 stroke: "#6B7280",
//                 fill: "#fff",
//               }}
//               animationDuration={800}
//             />

//             {/* Future line */}
//             <Line
//               data={futureData}
//               type="monotone"
//               dataKey="total"
//               stroke="#9CA3AF"
//               strokeWidth={3}
//               strokeDasharray="6 6"
//               dot={false}
//               isAnimationActive={false}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }






























































"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import moment from "moment";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const FILTERS = [
  { label: "Today", value: "1" },
  { label: "This Week", value: "7" },
  { label: "This Month", value: "30" },
];

export default function SalesDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    dailyOrders: [],
    dailyRevenue: [],
  });
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7");
  const [mode, setMode] = useState("comparison"); // orders, revenue, comparison
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/order/admin-orders?range=${range}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setStats({
            totalOrders: data.totalOrders || 0,
            totalRevenue: data.totalRevenue || 0,
            dailyOrders: data.dailyOrders || [],
            dailyRevenue: data.dailyRevenue || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch sales stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [range]);

  // Merge dailyOrders + dailyRevenue into one array
  const combinedData = stats.dailyOrders.map((o) => {
    const revenueForDate =
      stats.dailyRevenue.find((r) => r.date === o.date)?.total || 0;
    return {
      date: o.date,
      label: moment(o.date).format("MMM D"),
      orders: o.count,
      revenue: revenueForDate,
    };
  });

  return (
    <div className="mt-2 space-y-6">
      {/* Header */}
      {/* <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-800">Sales Overview</h1>
        <p className="text-gray-600">
          Track total orders and revenue across different time ranges.
        </p>
      </div> */}

      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatCard label="Total Orders" value={stats.totalOrders} color="orange" />
        <StatCard
          label="Total Revenue"
          value={`$${Number(stats.totalRevenue).toLocaleString()}`}
          color="blue"
        />
      </div>

      {/* Show More toggle */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded hover:bg-orange-50 transition"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>

      {showMore && (
        <>
          {/* Time Filter */}
          <div className="flex space-x-2 mt-4">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setRange(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  range === f.value
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sales Chart */}
          <SalesChart
            combinedData={combinedData}
            stats={stats}
            mode={mode}
            setMode={setMode}
          />
        </>
      )}

    </div>
  );
}

// --- Reusable Components ---
const StatCard = ({ label, value, color }) => (
  <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className={`text-3xl font-bold text-${color}-500 mt-2`}>{value}</p>
  </div>
);

const SalesChart = ({ combinedData, stats, mode, setMode }) => (
  <div className="bg-white shadow rounded-2xl p-4 sm:p-6 border border-gray-100 mt-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Sales Trend
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Orders & Revenue over the selected period.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
          Total Orders: {stats.totalOrders}
        </span>
        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          Total Revenue: ${Number(stats.totalRevenue).toLocaleString()}
        </span>
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      <ChartToggle
        label="Orders"
        active={mode === "orders"}
        onClick={() => setMode("orders")}
      />
      <ChartToggle
        label="Revenue"
        active={mode === "revenue"}
        onClick={() => setMode("revenue")}
      />
      <ChartToggle
        label="Comparison"
        active={mode === "comparison"}
        onClick={() => setMode("comparison")}
      />
    </div>

    <div className="w-full h-60 sm:h-72 md:h-80">
      <ResponsiveContainer>
        <LineChart
          data={combinedData}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            interval="preserveStartEnd"
            tickFormatter={(iso) =>
              combinedData.find((d) => d.date === iso)?.label || iso
            }
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#6b7280" }} />
          <Tooltip />
          <Legend />
          {(mode === "orders" || mode === "comparison") && (
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          )}
          {(mode === "revenue" || mode === "comparison") && (
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ChartToggle = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm ${
      active ? "bg-orange-500 text-white" : "bg-gray-200"
    }`}
  >
    {label}
  </button>
);
