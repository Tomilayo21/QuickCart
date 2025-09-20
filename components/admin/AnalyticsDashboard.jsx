// "use client";
// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { format, parseISO } from "date-fns";

// const FILTERS = [
//   { label: "Today", value: "1" },
//   { label: "Last 7 Days", value: "7" },
//   { label: "Last 30 Days", value: "30" },
// ];

// export default function AnalyticsDashboard() {
//   const [stats, setStats] = useState({
//     totalVisitors: 0,
//     totalPageViews: 0,
//     totalClicks: 0,
//     topPages: [],
//     dailyViews: [],
//     dailyClicks: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [range, setRange] = useState("7");
//   const [mode, setMode] = useState("comparison"); // "views" | "clicks" | "comparison"

//   useEffect(() => {
//     const fetchStats = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/analytics?range=${range}`);
//         const data = await res.json();
//         setStats(data);
//       } catch (err) {
//         console.error("Failed to fetch analytics:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [range]);

//   // Merge dailyViews + dailyClicks + dailyVisitors
//   const combinedData = stats.dailyViews.map((v) => {
//     const clicksForDate =
//       stats.dailyClicks.find((c) => c.date === v.date)?.count || 0;
//     const visitorsForDate =
//       stats.dailyVisitors.find((u) => u.date === v.date)?.count || 0;

//     return {
//       date: v.date,    // keep ISO (yyyy-MM-dd)
//       label: v.label,  // keep pretty for X axis
//       views: v.count,
//       clicks: clicksForDate,
//       visitors: visitorsForDate,
//     };
//   });

//   return (
//     <div className="mt-10 space-y-8">
//       {/* Header */}
//       <div className="space-y-2">
//         <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
//         <p className="text-gray-600">
//           Track visitors, page views, and engagement across your site.  
//           Use the filters below to explore trends over time.
//         </p>
//       </div>

//       {/* Time Filter */}
//       <div className="flex space-x-2">
//         {FILTERS.map((f) => (
//           <button
//             key={f.value}
//             onClick={() => setRange(f.value)}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//               range === f.value
//                 ? "bg-orange-500 text-white shadow"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             {f.label}
//           </button>
//         ))}
//       </div>

//       {/* Stats cards */}
//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <p className="text-gray-500">Loading analytics...</p>
//         </div>
//       ) : (
//         <>
//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
//               <h3 className="text-sm font-medium text-gray-500">Visitors</h3>
//               <p className="text-3xl font-bold text-orange-500 mt-2">
//                 {stats.totalVisitors}
//               </p>
//             </div>

//             <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
//               <h3 className="text-sm font-medium text-gray-500">Page Views</h3>
//               <p className="text-3xl font-bold text-orange-500 mt-2">
//                 {stats.totalPageViews}
//               </p>
//             </div>

//             <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
//               <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
//               <p className="text-3xl font-bold text-orange-500 mt-2">
//                 {stats.totalClicks}
//               </p>
//             </div>
//           </div>

//           {/* Combined Chart */}
//           <div className="bg-white shadow rounded-2xl p-4 sm:p-6 border border-gray-100">
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
//               <div>
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-700">
//                   Engagement Trend
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-500">
//                   Views, Clicks & Visitors over the selected period.
//                 </p>
//               </div>

//               {/* Stats Pills */}
//               <div className="flex flex-wrap gap-2">
//                 <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
//                   Total Views: {stats.totalPageViews}
//                 </span>
//                 <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
//                   Total Clicks: {stats.totalClicks}
//                 </span>
//                 <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
//                   Total Visitors: {stats.totalVisitors}
//                 </span>
//               </div>
//             </div>

//             {/* Toggle buttons */}
//             <div className="flex gap-2 mb-4">
//               <button
//                 onClick={() => setMode("views")}
//                 className={`px-3 py-1 rounded text-sm ${
//                   mode === "views" ? "bg-orange-500 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 Views
//               </button>
//               <button
//                 onClick={() => setMode("clicks")}
//                 className={`px-3 py-1 rounded text-sm ${
//                   mode === "clicks" ? "bg-gray-500 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 Clicks
//               </button>
//               <button
//                 onClick={() => setMode("visitors")}
//                 className={`px-3 py-1 rounded text-sm ${
//                   mode === "visitors" ? "bg-blue-500 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 Visitors
//               </button>
//               <button
//                 onClick={() => setMode("comparison")}
//                 className={`px-3 py-1 rounded text-sm ${
//                   mode === "comparison" ? "bg-gray-800 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 Comparison
//               </button>
//             </div>

//             <div className="w-full h-60 sm:h-72 md:h-80">
//               <ResponsiveContainer>
//                 <LineChart
//                   data={combinedData}
//                   margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   {/* <XAxis
//                   dataKey="date"
//                   tick={{ fontSize: 10, fill: "#6b7280" }}
//                   interval="preserveStartEnd"
//                   tickFormatter={(str) => {
//                       try {
//                       return format(parseISO(str), "MMM d"); // e.g. Sep 10
//                       } catch {
//                       return str;
//                       }
//                   }}
//                   /> */}
//                   <XAxis
//                     dataKey="date"
//                     tick={{ fontSize: 10, fill: "#6b7280" }}
//                     interval="preserveStartEnd"
//                     tickFormatter={(iso) => {
//                       const match = combinedData.find((d) => d.date === iso);
//                       return match?.label || iso;
//                     }}
//                   />



//                   <YAxis
//                     allowDecimals={false}
//                     tick={{ fontSize: 10, fill: "#6b7280" }}
//                   />
//                   <Tooltip />
//                   <Legend />

//                   {(mode === "views" || mode === "comparison") && (
//                     <Line
//                       type="monotone"
//                       dataKey="views"
//                       stroke="#f97316"
//                       strokeWidth={2}
//                       dot={{ r: 2 }}
//                       activeDot={{ r: 4 }}
//                     />
//                   )}
//                   {(mode === "clicks" || mode === "comparison") && (
//                     <Line
//                       type="monotone"
//                       dataKey="clicks"
//                       stroke="#6b7280"
//                       strokeWidth={2}
//                       dot={{ r: 2 }}
//                       activeDot={{ r: 4 }}
//                     />
//                   )}
//                   {(mode === "visitors" || mode === "comparison") && (
//                     <Line
//                       type="monotone"
//                       dataKey="visitors"
//                       stroke="#3b82f6" // blue for visitors
//                       strokeWidth={2}
//                       dot={{ r: 2 }}
//                       activeDot={{ r: 4 }}
//                     />
//                   )}

//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Top Pages Viewed */}
//             <div className="bg-white shadow rounded-2xl p-6 border border-gray-100 w-full overflow-x-auto">
//             <h3 className="text-lg font-semibold text-gray-700 mb-1">
//                 Top Pages Viewed
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//                 Most visited pages ranked by total views.
//             </p>

//             <table className="w-full text-left border-collapse min-w-[300px]">
//                 <thead>
//                 <tr className="border-b border-gray-200">
//                     <th className="py-2 text-sm font-medium text-gray-600">Page</th>
//                     <th className="py-2 text-sm font-medium text-gray-600">Views</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {stats.topPages.length > 0 ? (
//                     stats.topPages.map((page, idx) => {
//                     // Convert /something → Something
//                     const displayName =
//                         page._id === "/"
//                         ? "Home"
//                         : page._id
//                             .replace(/^\//, "")
//                             .split("-")
//                             .map((w) => w[0].toUpperCase() + w.slice(1))
//                             .join(" ");

//                     return (
//                         <tr
//                         key={idx}
//                         className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${
//                             idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"
//                         }`}
//                         >
//                         <td className="py-2 text-gray-800">{displayName}</td>
//                         <td className="py-2 font-semibold text-gray-700">{page.views}</td>
//                         </tr>
//                     );
//                     })
//                 ) : (
//                     <tr>
//                     <td colSpan="2" className="py-2 text-gray-500 italic text-center">
//                         No data yet
//                     </td>
//                     </tr>
//                 )}
//                 </tbody>
//             </table>
//             </div>

//         </>
//       )}
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

const FILTERS = [
  { label: "Today", value: "1" },
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
];

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    totalClicks: 0,
    topPages: [],
    dailyViews: [],
    dailyClicks: [],
    dailyVisitors: [],
  });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7");
  const [mode, setMode] = useState("comparison");
  const [showMore, setShowMore] = useState(false); // toggle for the rest

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?range=${range}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [range]);

  const combinedData = stats.dailyViews.map((v) => {
    const clicksForDate =
      stats.dailyClicks.find((c) => c.date === v.date)?.count || 0;
    const visitorsForDate =
      stats.dailyVisitors.find((u) => u.date === v.date)?.count || 0;

    return {
      date: v.date,
      label: v.label,
      views: v.count,
      clicks: clicksForDate,
      visitors: visitorsForDate,
    };
  });

  return (
    <div className="mt-10 space-y-6">
      {/* Top 3 Stats always visible */}
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
          <p className="text-gray-600">
            Track visitors, page views, and engagement across your site.  
            Use the filters and toggle below to explore detailed trends.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard label="Visitors" value={stats.totalVisitors} color="orange" />
          <StatCard label="Page Views" value={stats.totalPageViews} color="orange" />
          <StatCard label="Clicks" value={stats.totalClicks} color="orange" />
        </div>
      </div>


      {/* Show More / Less toggle */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded hover:bg-orange-50 transition"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>

      {/* Rest of the dashboard */}
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

          {/* Engagement Chart */}
          <EngagementChart combinedData={combinedData} stats={stats} mode={mode} setMode={setMode} />

          {/* Top Pages Viewed */}
          <TopPages topPages={stats.topPages} />
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

const EngagementChart = ({ combinedData, stats, mode, setMode }) => (
  <div className="bg-white shadow rounded-2xl p-4 sm:p-6 border border-gray-100 mt-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Engagement Trend
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Views, Clicks & Visitors over the selected period.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
          Total Views: {stats.totalPageViews}
        </span>
        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
          Total Clicks: {stats.totalClicks}
        </span>
        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          Total Visitors: {stats.totalVisitors}
        </span>
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      <ChartToggle label="Views" active={mode === "views"} onClick={() => setMode("views")} />
      <ChartToggle label="Clicks" active={mode === "clicks"} onClick={() => setMode("clicks")} />
      <ChartToggle label="Visitors" active={mode === "visitors"} onClick={() => setMode("visitors")} />
      <ChartToggle label="Comparison" active={mode === "comparison"} onClick={() => setMode("comparison")} />
    </div>

    <div className="w-full h-60 sm:h-72 md:h-80">
      <ResponsiveContainer>
        <LineChart data={combinedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            interval="preserveStartEnd"
            tickFormatter={(iso) => combinedData.find((d) => d.date === iso)?.label || iso}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#6b7280" }} />
          <Tooltip />
          <Legend />
          {(mode === "views" || mode === "comparison") && (
            <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          )}
          {(mode === "clicks" || mode === "comparison") && (
            <Line type="monotone" dataKey="clicks" stroke="#6b7280" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          )}
          {(mode === "visitors" || mode === "comparison") && (
            <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const TopPages = ({ topPages }) => {
  const top3 = topPages.slice(0, 3);
  return (
    <div className="bg-white shadow rounded-2xl p-6 border border-gray-100 w-full overflow-x-auto mt-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-1">Top Pages Viewed</h3>
      <p className="text-sm text-gray-500 mb-4">Most visited pages ranked by total views.</p>

      <table className="w-full text-left border-collapse min-w-[300px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 text-sm font-medium text-gray-600">Page</th>
            <th className="py-2 text-sm font-medium text-gray-600">Views</th>
          </tr>
        </thead>
        <tbody>
          {top3.length > 0 ? (
            top3.map((page, idx) => {
              const displayName =
                page._id === "/"
                  ? "Home"
                  : page._id
                      .replace(/^\//, "")
                      .split("-")
                      .map((w) => w[0].toUpperCase() + w.slice(1))
                      .join(" ");
              return (
                <tr
                  key={idx}
                  className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${
                    idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  }`}
                >
                  <td className="py-2 text-gray-800">{displayName}</td>
                  <td className="py-2 font-semibold text-gray-700">{page.views}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="2" className="py-2 text-gray-500 italic text-center">
                No data yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const ChartToggle = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm ${active ? "bg-orange-500 text-white" : "bg-gray-200"}`}
  >
    {label}
  </button>
);
