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
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";



export default function AdminDashboard({
  setActiveView,
  setActiveTab,
  setUserPanel,
  setOrderPanel,
}) {
  const { getToken } = useAuth();
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
  const [todayDeposit, setTodayDeposit] = useState(0);
  const [yesterdayDeposit, setYesterdayDeposit] = useState(0);
  const [prevMonthTotal, setPrevMonthTotal] = useState(0);
  const [prevMonthCount, setPrevMonthCount] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useUser();
  const [allCustomers, setAllCustomers] = useState(0);  
  const [newCustomers, setNewCustomers] = useState(0);  
  

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();

        console.log("[/api/customers] response:", data);

        if (data.success) {
          setAllCustomers(data.allCustomers ?? 0);
          setNewCustomers(data.newCustomers ?? 0);
        } else {
          console.error("Failed to fetch counts:", data.error);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchUserCounts();
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

  const fetchAdminOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/admin-orders?limit=5&page=1", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAdminOrders();
  }, [user]);

  useEffect(() => {
    if (orders.length) {
      orders.forEach((order, i) => {
        console.log(`Order #${i + 1}`);
        console.log("Full Name:", order.address?.fullName || "Missing");
        console.log("Country:", order.address?.country || "Missing");
        console.log("State:", order.address?.state || "Missing");
        console.log("City:", order.address?.city || "Missing");
        console.log("Phone Number:", order.address?.phoneNumber || "Missing");
        console.log("----------------------------");
      });
    } if (orders.length === 0) {
      console.log("No orders found or address is not populated.");
    }
  }, [orders]);

  const fetchTopProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/order/top-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setTopProducts(data.topProducts);
    } catch (err) {
      console.error("Error fetching top products:", err);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);
      
  

  const projectGrowth =
    prevMonthTotal > 0
      ? (((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100).toFixed(1)
      : thisMonthTotal > 0
      ? "100.0"
      : "0.0";

  
  const COLORS = ["#FFB020", "#1E90FF", "#4CAF50", "#FF6347", "#A0AEC0"];

  const stats = [
    {
      title: "Total Sales",
      value: `${currency}${totalDeposit.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <DollarSign className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Total Orders",
      value: thisMonthTransactionCount.toString(),
      icon: <CreditCard className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Total Customers",
      value: allCustomers.toString(), // ✅ all-time
      icon: <Users className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "New Customers",
      value: newCustomers.toString(), // ✅ last 7 days
      icon: <Users className="w-6 h-6 text-orange-600" />,
    },
    {
      title: "Conversion",
      value: `${(
        (thisMonthTransactionCount / Math.max(userCount, 1)) *
        100
      ).toFixed(1)}%`,
      icon: <TrendingUp className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Avg. Order Value",
      value:
        thisMonthTransactionCount > 0
          ? `${currency}${(thisMonthTotal / thisMonthTransactionCount).toFixed(2)}`
          : `${currency}0.00`,
      icon: <FileBarChart className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Subscribers",
      value: subscriberCount.toString(),
      icon: <UserCheck className="w-6 h-6 text-gray-600" />,
    },
    {
      title: "Monthly Growth %",
      value: `${projectGrowth}%`,
      icon: <Rocket className="w-6 h-6 text-gray-600" />,
    },
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


        {/* === Top Products Section === */}
        <div className="space-y-4 mt-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Top Products</h1>
            <p className="text-gray-600 text-sm">
              See which products generate the most revenue and sales.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <div className="overflow-x-auto">
              {topProducts.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">Units Sold</th>
                      <th className="px-4 py-2">Revenue</th>
                      <th className="px-4 py-2">Stock Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{p.product}</td>
                        <td className="px-4 py-2">{p.units}</td>
                        <td className="px-4 py-2">
                          {currency}
                          {Number(p.revenue).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-2">{p.stock} left</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No products found.</p>
              )}
            </div>
          </div>
        </div>

        {/* === Recent Orders Section === */}
        <div className="space-y-4 mt-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Recent Orders</h1>
            <p className="text-gray-600 text-sm">
              Track your latest orders and payment statuses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <div className="overflow-x-auto">
              {orders.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">Customer</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Order Status</th>
                      <th className="px-4 py-2">Payment Status</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((order, idx) => (
                        <tr key={order._id} className="border-t hover:bg-gray-50 transition">
                          <td className="px-4 py-2">{order.address?.fullName || "N/A"}</td>
                          <td className="px-4 py-2">
                            {order.amount
                              ? `$${order.amount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : "N/A"}
                          </td>
                          <td
                            className={`px-4 py-2 font-medium ${
                              order.orderStatus === "Delivered"
                                ? "text-green-600"
                                : order.orderStatus === "Pending"
                                ? "text-orange-500"
                                : order.orderStatus === "Cancelled"
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {order.orderStatus || "N/A"}
                          </td>
                          <td
                            className={`px-4 py-2 font-medium ${
                              order.paymentStatus === "Paid"
                                ? "text-green-600"
                                : order.paymentStatus === "Pending"
                                ? "text-orange-500"
                                : order.paymentStatus === "Failed"
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {order.paymentStatus || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No orders available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Chart */}
        <div className="space-y-4 mt-8">
          <h1 className="text-2xl font-bold text-gray-800">Sales Overview</h1>
          <p className="text-gray-600">
            Track total orders and revenue across different time ranges.
          </p>
        </div>

        <div className="mt-8 bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <AnimatePresence>
            <motion.div
              key="chart"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden mt-4"
            >
              <div className="">
                <DashboardChart
                  dailyTrend={dailyTrendData}
                  monthlyTrend={monthlyTrendData}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
                

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
