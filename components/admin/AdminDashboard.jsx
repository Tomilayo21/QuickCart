"use client";
import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users,
  DollarSign,
  TrendingUp,
  Rocket,
  FileBarChart,
  CreditCard,
  UserCheck,
  Eye,
  EyeOff,
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import MiniChart from "./settings/charts/MiniChart";
import DashboardChart from "./settings/charts/DashboardChart";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsDashboard from "./AnalyticsDashboard";


export default function AdminDashboard({
  setActiveView,
  setActiveTab,
  setUserPanel,
  setOrderPanel,
}) {
  const [userCount, setUserCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const { currency } = useAppContext();
  const [statsData, setStats] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [dailyTrendData, setDailyTrendData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [todayTransactionCount, setTodayTransactionCount] = useState(0);
  const [yesterdayTransactionCount, setYesterdayTransactionCount] = useState(0);
  const [thisMonthTransactionCount, setThisMonthTransactionCount] = useState(0);
  const [showIcons, setShowIcons] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [todayDeposit, setTodayDeposit] = useState(0);
  const [yesterdayDeposit, setYesterdayDeposit] = useState(0);
  const [prevMonthTotal, setPrevMonthTotal] = useState(0);
  const [prevMonthCount, setPrevMonthCount] = useState(0);




  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch("/api/clerk-users");
        const data = await res.json();
        if (Array.isArray(data)) {
          setUserCount(data.length);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUserCount();
  }, []);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/admin/subscribers");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSubscriberCount(data.length);
        }
      } catch (err) {
        console.error("Failed to fetch subscribers", err);
      }
    };
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/stats/growth");
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDepositStats = async () => {
      try {
        const res = await fetch("/api/admin/transactions?page=1&limit=1");
        const data = await res.json();

        setTotalDeposit(data.totalAmount || 0);
        setDailyTotal(data.last24HoursAmount || 0);
        setDailyTrendData(data.dailyTrend || []);
        setMonthlyTrendData(data.monthlyTrend || []);
        setTodayTransactionCount(data.todayCount || 0);
        setYesterdayTransactionCount(data.yesterdayCount || 0);
        setThisMonthTransactionCount(data.thisMonthCount || 0);
        setTodayDeposit(data.todayAmount || 0);
        setYesterdayDeposit(data.yesterdayAmount || 0);
        setPrevMonthTotal(data.prevMonthTotal || 0);
        setPrevMonthCount(data.prevMonthCount || 0);


        // ✅ Sum up all totals for this month
        const monthTotal = Array.isArray(data.monthlyTrend)
          ? data.monthlyTrend.reduce((sum, day) => sum + (day.total || 0), 0)
          : 0;

        setThisMonthTotal(monthTotal);
      } catch (error) {
        console.error("Failed to fetch deposit stats", error);
      }
    };

    fetchDepositStats();
  }, []);

  const monthlyPercentage =
    totalDeposit > 0
      ? ((thisMonthTotal / totalDeposit) * 100).toFixed(1)
      : "0.0";

  const dailyPercentageOfMonth =
    thisMonthTotal > 0
      ? ((dailyTotal / thisMonthTotal) * 100).toFixed(1)
      : "0.0";

  const dailyChange =
    yesterdayDeposit === 0
      ? todayDeposit > 0
        ? "100.0"
        : "0.0"
      : (((todayDeposit - yesterdayDeposit) / yesterdayDeposit) * 100).toFixed(1);

  const dailyPercentageOfTotal =
    totalDeposit > 0
      ? ((dailyTotal / totalDeposit) * 100).toFixed(1)
      : "0.0";


  function calculateChangePercentage(monthlyStats, totalDeposit) {
    if (!Array.isArray(monthlyStats) || monthlyStats.length === 0 || totalDeposit === 0) {
      return "0.0%";
    }

    // Sort by actual date
    const sorted = [...monthlyStats].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const current = sorted[0]?.total || 0;

    const percentage = (current / totalDeposit) * 100;
    return `${percentage.toFixed(1)}%`;
  }


  const transactionChange =
    yesterdayTransactionCount === 0
      ? todayTransactionCount > 0
        ? "100.0"
        : "0.0"
      : (
          ((todayTransactionCount - yesterdayTransactionCount) /
            yesterdayTransactionCount) *
          100
        ).toFixed(1);

        
  // const growthPercentage =
  //   totalDeposit > 0
  //     ? ((thisMonthTotal / totalDeposit) * 100).toFixed(1)
  //     : "0.0";
  const projectGrowth =
    prevMonthTotal > 0
      ? (((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100).toFixed(1)
      : thisMonthTotal > 0
      ? "100.0"
      : "0.0";

  const stats = [
    {
      title: "Total Users",
      value: userCount.toString(),
      change: "+100%",
      icon: <Users className="w-6 h-6 text-gray-600" />,
      onClick: () => {
        setActiveTab("users");
        setActiveView("settings");
      },
    },
    {
      title: "Active Subscribers",
      value: subscriberCount.toString(),
      change: `${((subscriberCount / userCount) * 100).toFixed(1)}%`,
      icon: <UserCheck className="w-6 h-6  text-gray-600" />,
      onClick: () => {
        setActiveTab("users");
        setUserPanel("subscribers");
        setActiveView("settings");
      },
    },
    {
      title: "Total Deposit",
      value: `${currency}${totalDeposit.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: "",
      icon: <DollarSign className="w-6 h-6  text-gray-600" />,
    },
    {
      title: "This Month's Deposit",
      value: `${currency}${thisMonthTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: (
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            thisMonthTotal > prevMonthTotal
              ? "text-green-600"
              : thisMonthTotal < prevMonthTotal
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {thisMonthTotal > prevMonthTotal && <ArrowUpRight className="w-4 h-4" />}
          {thisMonthTotal < prevMonthTotal && (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {totalDeposit > 0
            ? ((thisMonthTotal / totalDeposit) * 100).toFixed(1)
            : "0.0"}
          %
        </span>
      ),
      icon: <FileBarChart className="w-6 h-6 text-gray-600" />,
      onClick: () => {
        setActiveTab("orders");
        setOrderPanel("transactions");
        setActiveView("settings");
      },
    },
    {
      title: "This Month's Transactions",
      value: thisMonthTransactionCount.toString(),
      change: (
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            thisMonthTransactionCount > prevMonthCount
              ? "text-green-600"
              : thisMonthTransactionCount < prevMonthCount
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {thisMonthTransactionCount > prevMonthCount && (
            <ArrowUpRight className="w-4 h-4" />
          )}
          {thisMonthTransactionCount < prevMonthCount && (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {prevMonthCount > 0
            ? (
                ((thisMonthTransactionCount - prevMonthCount) / prevMonthCount) *
                100
              ).toFixed(1)
            : "0.0"}
          %
        </span>
      ),
      icon: <CreditCard className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Daily Deposit",
      value: `${currency}${todayDeposit.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: (
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            dailyChange > 0
              ? "text-green-600"
              : dailyChange < 0
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {dailyChange > 0 && <ArrowUpRight className="w-4 h-4" />}
          {dailyChange < 0 && <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(dailyChange).toFixed(1)}%
        </span>
      ),
      icon: <TrendingUp className="w-6 h-6 text-grey-600" />,
      chart: true,
      onClick: () => {
        setActiveTab("orders");
        setOrderPanel("transactions");
        setActiveView("settings");
      },
    },
    // {
    //   title: "Growth",
    //   value: `${growthPercentage}%`,
    //   change: "",
    //   icon: <Rocket className="w-6 h-6  text-gray-600" />,
    // },

    {
      title: "Growth",
      value: `${projectGrowth}%`,
      change: (
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            projectGrowth > 0
              ? "text-green-600"
              : projectGrowth < 0
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {projectGrowth > 0 && <ArrowUpRight className="w-4 h-4" />}
          {projectGrowth < 0 && <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(projectGrowth)}%
        </span>
      ),
      icon: <Rocket className="w-6 h-6 text-gray-600" />,
    }

  ];

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6">
        {/* Header */}
        <AdminHeader />

        {/* Icon Toggle */}
        <button
          onClick={() => setShowIcons(!showIcons)}
          className="mb-4 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
        >
          {showIcons ? (
            <>
              <EyeOff className="w-4 h-4 text-gray-500" />
              <span>Hide Icons</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-gray-500" />
              <span>Show Icons</span>
            </>
          )}
        </button>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              className={`group bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 ${
                item.onClick ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                {showIcons && (
                  <span className="text-2xl text-gray-600 group-hover:text-blue-600 transition">
                    {item.icon}
                  </span>
                )}
                <span className="text-xs font-semibold text-orange-600">{item.change}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Bottom Stats with Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.slice(3).map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              className={`group bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 ${
                idx === 0 ? "sm:col-span-2" : "sm:col-span-1"
              } ${item.onClick ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                {showIcons && (
                  <span className="text-2xl text-gray-600 group-hover:text-blue-600 transition">
                    {item.icon}
                  </span>
                )}
                <span className="text-xs font-semibold text-orange-600">{item.change}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                {item.chart && (
                  <div className="mt-3">
                    <MiniChart data={dailyTrendData} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Chart */}
        <div className="mt-8 bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <button
            onClick={() => setShowChart((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600 transition"
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </button>

          <AnimatePresence>
            {showChart && (
              <motion.div
                key="chart"
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-6">
                  <DashboardChart
                    dailyTrend={dailyTrendData}
                    monthlyTrend={monthlyTrendData}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
