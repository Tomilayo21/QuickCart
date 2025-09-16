// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import toast from "react-hot-toast";
// import { useAppContext } from "@/context/AppContext";
// import Papa from "papaparse";
// import { CreditCard, FileText } from "lucide-react";


// dayjs.extend(relativeTime);


// export default function TransactionPanel() {
//   const [transactions, setTransactions] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortKey, setSortKey] = useState("dateDesc"); 
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [enlargedImg, setEnlargedImg] = useState(null);
//   const { getToken, currency } = useAppContext()
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [totalPages, setTotalPages] = useState(1);

  

//   const exportToCSV = () => {
//     const csv = Papa.unparse(
//       filteredTransactions.map((txn) => ({
//         OrderID: txn.orderId,
//         UserID: txn.userId,
//         Amount: txn.amount,
//         PaymentMethod: txn.paymentMethod,
//         PaymentStatus: txn.paymentStatus,
//         OrderStatus: txn.orderStatus,
//         ProofOfPayment: txn.proofOfPaymentUrl || "",
//         Date: new Date(txn.date).toLocaleString(),
//       }))
//     );

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "transactions.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [page]);

//   const fetchTransactions = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`/api/admin/transactions?page=${page}&limit=${pageSize}`);
//       setTransactions(res.data.transactions || []);
//       setTotalPages(Math.ceil(res.data.totalCount / pageSize));
//     } catch (error) {
//       console.error("Failed to fetch transactions", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredTransactions = transactions.filter((txn) =>
//     txn.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     txn._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     txn.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     txn.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const updatePaymentStatus = async (orderId, status) => {
//     try {
//       const token = await getToken(); // from your AppContext
//       const res = await axios.post(
//         "/api/admin/order/payment-status",
//         { orderId, status },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // this must be valid
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success("Updated payment status");
//         setTransactions((prev) =>
//           prev.map((txn) =>
//             txn._id === orderId ? { ...txn, paymentStatus: status } : txn
//           )
//         );
//       } else {
//         toast.error(res.data.message || "Failed to update");
//       }
//     } catch (err) {
//       console.error("AXIOS ERROR:", err.response?.data || err.message);
//       toast.error(err.response?.data?.message || "Failed to update payment status");
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.post("/api/order/update-status", { orderId, status }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         toast.success("Status updated");
//         // fetchAdminOrders(); // Refresh
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const sortedTransactions = [...filteredTransactions].sort((a, b) => {
//     if (!sortConfig.key) return 0;

//     const aVal = a[sortConfig.key]?.toString().toLowerCase();
//     const bVal = b[sortConfig.key]?.toString().toLowerCase();

//     if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
//     if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };
//   const [collapsedSections, setCollapsedSections] = useState({});

//   const toggleSection = (date) => {
//     setCollapsedSections((prev) => ({
//       ...prev,
//       [date]: !prev[date],
//     }));
//   };

//   const today = new Date().toDateString();
//   const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
//   const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));

//   const todayTotal = filteredTransactions.reduce(
//     (acc, txn) => new Date(txn.date).toDateString() === today ? acc + txn.amount : acc,
//     0
//   );
//   const weekTotal = filteredTransactions.reduce(
//     (acc, txn) => new Date(txn.date) >= oneWeekAgo ? acc + txn.amount : acc,
//     0
//   );
//   const monthTotal = filteredTransactions.reduce(
//     (acc, txn) => new Date(txn.date) >= oneMonthAgo ? acc + txn.amount : acc,
//     0
//   );

//   return (
//     <div className="flex-1 overflow-auto h-screen p-6 bg-gray-50 dark:bg-neutral-900">
//       {/* Header */}
//       <div className="flex flex-col mb-6 gap-4">
//         {/* Header */}
//         <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
//           <CreditCard className="w-6 h-6 text-orange-600" />
//           Transactions
//         </h1>

//         {/* Controls: Search, Sorting, Export */}
//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center sm:justify-start">
//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search by user, order, status..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
//           />

//           {/* Sorting */}
//           <select
//             value={sortKey}
//             onChange={(e) => setSortKey(e.target.value)}
//             className="w-full sm:w-auto p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
//           >
//             <option value="dateDesc">Newest</option>
//             <option value="dateAsc">Oldest</option>
//             <option value="amountDesc">Highest Amount</option>
//             <option value="amountAsc">Lowest Amount</option>
//           </select>

//           {/* Export CSV */}
//           <button
//             onClick={exportToCSV}
//             className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded shadow transition"
//           >
//             <FileText className="w-4 h-4" /> Export CSV
//           </button>
//         </div>
//       </div>


//       {/* Totals Cards */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow hover:shadow-md transition">
//           <h3 className="text-sm font-semibold text-gray-500">Today's Total</h3>
//           <p className="text-xl font-bold mt-1">{currency}{todayTotal.toFixed(2)}</p>
//         </div>
//         <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow hover:shadow-md transition">
//           <h3 className="text-sm font-semibold text-gray-500">Last 7 Days</h3>
//           <p className="text-xl font-bold mt-1">{currency}{weekTotal.toFixed(2)}</p>
//         </div>
//         <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow hover:shadow-md transition">
//           <h3 className="text-sm font-semibold text-gray-500">Last 30 Days</h3>
//           <p className="text-xl font-bold mt-1">{currency}{monthTotal.toFixed(2)}</p>
//         </div>
//       </div>

//       {/* Transactions List */}
//       {loading ? (
//         <p className="text-gray-500">Loading transactions...</p>
//       ) : (
//         Object.entries(
//           sortedTransactions.reduce((groups, txn) => {
//             const dateKey = new Date(txn.date).toLocaleDateString();
//             if (!groups[dateKey]) groups[dateKey] = [];
//             groups[dateKey].push(txn);
//             return groups;
//           }, {})
//         )
//           .sort((a, b) => new Date(b[0]) - new Date(a[0]))
//           .map(([date, transactionsOfDay], index) => {
//             const totalAmount = transactionsOfDay.reduce((sum, txn) => sum + (txn.amount || 0), 0);
//             const isCollapsed = collapsedSections[date] ?? (index !== 0);

//             return (
//               <div key={date} className="mb-6 border rounded-lg bg-white dark:bg-neutral-800 shadow">
//                 {/* Date Header */}
//                 <div
//                   className="flex justify-between items-center p-3 bg-gray-100 dark:bg-neutral-700 cursor-pointer rounded-t-lg"
//                   onClick={() => toggleSection(date)}
//                 >
//                   <h2 className="font-semibold text-gray-700 dark:text-gray-200">
//                     {new Date(date).toLocaleDateString("en-GB", {
//                       weekday: "long",
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                     })}
//                   </h2>
//                   <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
//                     Total: {currency}{totalAmount.toFixed(2)} • {isCollapsed ? "Show ▼" : "Hide ▲"}
//                   </div>
//                 </div>

//                 {!isCollapsed && (
//                   <>
//                     {/* Desktop Table */}
//                     <div className="hidden sm:block overflow-x-auto">
//                       <table className="min-w-full text-sm border-collapse border border-gray-300 dark:border-neutral-700">
//                         <thead className="bg-gray-50 dark:bg-neutral-700">
//                           <tr>
//                             <th className="border px-2 py-1 cursor-pointer" onClick={() => requestSort('_id')}>Order ID</th>
//                             <th className="border px-2 py-1">User ID</th>
//                             <th className="border px-2 py-1 cursor-pointer" onClick={() => requestSort('amount')}>Amount</th>
//                             <th className="border px-2 py-1 cursor-pointer" onClick={() => requestSort('paymentMethod')}>Payment Method</th>
//                             <th className="border px-2 py-1 cursor-pointer" onClick={() => requestSort('paymentStatus')}>Payment Status</th>
//                             <th className="border px-2 py-1 cursor-pointer" onClick={() => requestSort('orderStatus')}>Order Status</th>
//                             <th className="border px-2 py-1">Proof</th>
//                             <th className="border px-2 py-1">Date</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {transactionsOfDay.map((txn) => (
//                             <tr key={txn._id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
//                               <td className="border px-2 py-1">{txn.orderId}</td>
//                               <td className="border px-2 py-1">{txn.userId}</td>
//                               <td className="border px-2 py-1">{currency}{txn.amount?.toFixed(2)}</td>
//                               <td className="border px-2 py-1">{txn.paymentMethod}</td>
//                               <td className="border px-2 py-1">
//                                 <select
//                                   value={txn.paymentStatus}
//                                   onChange={(e) => updatePaymentStatus(txn._id, e.target.value)}
//                                   className="border text-xs px-2 py-1 rounded"
//                                 >
//                                   <option value="Pending">Pending</option>
//                                   <option value="Successful">Successful</option>
//                                   <option value="Refunded">Refunded</option>
//                                   <option value="Failed">Failed</option>
//                                 </select>
//                               </td>
//                               <td className="border px-2 py-1">
//                                 <select
//                                   value={txn.orderStatus}
//                                   onChange={(e) => updateOrderStatus(txn.orderId, e.target.value)}
//                                   className="border text-xs px-2 py-1 rounded"
//                                 >
//                                   <option value="Pending">Pending</option>
//                                   <option value="Order Placed">Order Placed</option>
//                                   <option value="Processing">Processing</option>
//                                   <option value="Shipped">Shipped</option>
//                                   <option value="Delivered">Delivered</option>
//                                   <option value="Cancelled">Cancelled</option>
//                                 </select>
//                               </td>
//                               <td className="border px-2 py-1 text-center">
//                                 {txn.proofOfPaymentUrl ? (
//                                   <img
//                                     src={txn.proofOfPaymentUrl}
//                                     alt="Proof"
//                                     className="w-12 h-12 object-cover rounded border cursor-pointer"
//                                     onClick={() => setEnlargedImg(txn.proofOfPaymentUrl)}
//                                   />
//                                 ) : (
//                                   <span className="text-gray-400">-</span>
//                                 )}
//                               </td>
//                               <td className="border px-2 py-1 text-xs">{new Date(txn.date).toLocaleString()}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile Cards */}
//                     <div className="sm:hidden flex flex-col gap-3 mt-3">
//                       {transactionsOfDay.map((txn) => (
//                         <div key={txn._id} className="border rounded-lg bg-white dark:bg-neutral-800 p-4 shadow hover:shadow-md transition">
//                           <p><span className="font-semibold">Order ID:</span> {txn.orderId}</p>
//                           <p><span className="font-semibold">User ID:</span> {txn.userId}</p>
//                           <p><span className="font-semibold">Amount:</span> {currency}{txn.amount?.toFixed(2)}</p>
//                           <p><span className="font-semibold">Payment Method:</span> {txn.paymentMethod}</p>
//                           <p>
//                             <span className="font-semibold">Payment Status:</span>
//                             <select
//                               className="ml-2 mt-1 p-1 text-sm border rounded"
//                               value={txn.paymentStatus}
//                               onChange={(e) => updatePaymentStatus(txn._id, e.target.value)}
//                             >
//                               <option value="Pending">Pending</option>
//                               <option value="Successful">Successful</option>
//                               <option value="Refunded">Refunded</option>
//                               <option value="Failed">Failed</option>
//                             </select>
//                           </p>
//                           <p>
//                             <span className="font-semibold">Order Status:</span>
//                             <select
//                               className="ml-2 mt-1 p-1 text-sm border rounded"
//                               value={txn.orderStatus}
//                               onChange={(e) => updateOrderStatus(txn.orderId, e.target.value)}
//                             >
//                               <option value="Pending">Pending</option>
//                               <option value="Order Placed">Order Placed</option>
//                               <option value="Processing">Processing</option>
//                               <option value="Shipped">Shipped</option>
//                               <option value="Delivered">Delivered</option>
//                               <option value="Cancelled">Cancelled</option>
//                             </select>
//                           </p>
//                           {txn.proofOfPaymentUrl && (
//                             <img
//                               src={txn.proofOfPaymentUrl}
//                               alt="Proof"
//                               className="w-24 h-24 object-cover rounded mt-2 cursor-pointer"
//                               onClick={() => setEnlargedImg(txn.proofOfPaymentUrl)}
//                             />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })
//       )}

//       {/* Enlarged proof modal */}
//       {enlargedImg && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
//           onClick={() => setEnlargedImg(null)}
//         >
//           <img
//             src={enlargedImg}
//             alt="Enlarged proof"
//             className="max-w-3xl max-h-full rounded shadow-lg"
//           />
//         </div>
//       )}
//     </div>

//   );

// }































"use client";

import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Papa from "papaparse";
import { CreditCard, FileText } from "lucide-react";


dayjs.extend(relativeTime);

export default function TransactionPanel() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("dateDesc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // server-side page size
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [enlargedImg, setEnlargedImg] = useState(null);
  const { getToken, currency } = useAppContext();
  const [summary, setSummary] = useState({
    last24HoursAmount: 0,
    last7DaysAmount: 0,
    last30DaysAmount: 0,
  });

  // 👉 Fetch transactions whenever page or pageSize changes
  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/transactions?page=${page}&limit=${pageSize}`
      );

      setTransactions(res.data.transactions || []);
      setTotalCount(res.data.totalCount || 0);

      setSummary({
        last24HoursAmount: res.data.last24HoursAmount ?? 0,
        last7DaysAmount: res.data.last7DaysAmount ?? 0,
        last30DaysAmount: res.data.last30DaysAmount ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 👉 total pages based on server totalCount
  const totalPages = Math.ceil(totalCount / pageSize);

  const exportToCSV = () => {
    const csv = Papa.unparse(
      transactions.map((txn) => ({
        OrderID: txn.orderId,
        UserID: txn.username,
        Amount: txn.amount,
        PaymentMethod: txn.paymentMethod,
        PaymentStatus: txn.paymentStatus,
        OrderStatus: txn.orderStatus,
        ProofOfPayment: txn.proofOfPaymentUrl || "",
        Date: new Date(txn.date).toLocaleString(),
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updatePaymentStatus = async (orderId, status) => {
    try {
      const token = await getToken();
      const res = await axios.post(
        "/api/admin/order/payment-status",
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Updated payment status");
        setTransactions((prev) =>
          prev.map((txn) =>
            txn._id === orderId ? { ...txn, paymentStatus: status } : txn
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update payment");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/update-status",
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Status updated");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // sort by newest
      .forEach(txn => {
        const day = new Date(txn.date).toLocaleDateString();
        if (!groups[day]) groups[day] = [];
        groups[day].push(txn);
      });
    return groups;
  }, [filteredTransactions]);

  if (loading) return <p className="text-gray-500">Loading transactions...</p>;

  return (
    <div className="flex-1 overflow-auto h-screen p-4 sm:p-6 bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex flex-col mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-orange-600" />
          Transactions
        </h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center sm:justify-start">
          <input
            type="text"
            placeholder="Search by user, order, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // reset to page 1
            }}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded shadow transition w-full sm:w-auto"
          >
            <FileText className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow text-center sm:text-left">
          <h3 className="text-sm font-semibold text-gray-500">Last 24hours</h3>
          <p className="text-xl font-bold mt-1">
            {currency}
            {summary.last24HoursAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow text-center sm:text-left">
          <h3 className="text-sm font-semibold text-gray-500">Last 7 Days</h3>
          <p className="text-xl font-bold mt-1">
            {currency}
            {summary.last7DaysAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow text-center sm:text-left">
          <h3 className="text-sm font-semibold text-gray-500">Last 30 Days</h3>
          <p className="text-xl font-bold mt-1">
            {currency}
            {summary.last30DaysAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions */}
      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([day, txns]) => (
            <div key={day}>
              {/* ✅ Day header */}
              <h2 className="text-base sm:text-lg font-semibold px-3 sm:px-4 py-2 bg-gray-100 dark:bg-neutral-700 border-b rounded-t-lg">
                {new Date(txns[0].date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>

              {/* ✅ Desktop table view */}
              <div className="hidden md:block overflow-x-auto border rounded-b-lg bg-white dark:bg-neutral-800 shadow">
                <table className="min-w-full text-sm border-collapse border border-gray-300 dark:border-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      <th className="border px-2 py-1">Order ID</th>
                      <th className="border px-2 py-1">User ID</th>
                      <th className="border px-2 py-1">Amount</th>
                      <th className="border px-2 py-1">Payment Method</th>
                      <th className="border px-2 py-1">Payment Status</th>
                      <th className="border px-2 py-1">Order Status</th>
                      <th className="border px-2 py-1">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns.map((txn) => (
                      <tr
                        key={txn._id}
                        className="hover:bg-gray-100 dark:hover:bg-neutral-700"
                      >
                        <td className="border px-2 py-1">{txn.orderId}</td>
                        <td className="border px-2 py-1">{txn.userId?.username}</td>
                        <td className="border px-2 py-1">
                          {currency}
                          {txn.amount?.toFixed(2)}
                        </td>
                        <td className="border px-2 py-1">{txn.paymentMethod}</td>
                        <td className="border px-2 py-1">
                          <select
                            value={txn.paymentStatus}
                            onChange={(e) =>
                              updatePaymentStatus(txn._id, e.target.value)
                            }
                            className="border text-xs px-2 py-1 rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Successful">Successful</option>
                            <option value="Refunded">Refunded</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>
                        <td className="border px-2 py-1">
                          <select
                            value={txn.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(txn.orderId, e.target.value)
                            }
                            className="border text-xs px-2 py-1 rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="border px-2 py-1 text-xs">
                          {new Date(txn.date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Mobile card view */}
              <div className="md:hidden space-y-3 mt-2">
                {txns.map((txn) => (
                  <div
                    key={txn._id}
                    className="border rounded-lg shadow-sm bg-white dark:bg-neutral-800 p-3"
                  >
                    {/* Header row */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{txn.orderId}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(txn.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="mt-2 text-sm space-y-1">
                      <p>
                        <span className="font-medium">User:</span> {txn.userId?.username}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span> {currency}
                        {txn.amount?.toFixed(2)}
                      </p>
                      <p>
                        <span className="font-medium">Method:</span> {txn.paymentMethod}
                      </p>
                    </div>

                    {/* Editable statuses */}
                    <div className="mt-3 flex flex-col gap-2">
                      <label className="text-xs font-medium">Payment Status</label>
                      <select
                        value={txn.paymentStatus}
                        onChange={(e) => updatePaymentStatus(txn._id, e.target.value)}
                        className="border text-xs px-2 py-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Successful">Successful</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Failed">Failed</option>
                      </select>

                      <label className="text-xs font-medium">Order Status</label>
                      <select
                        value={txn.orderStatus}
                        onChange={(e) => updateOrderStatus(txn.orderId, e.target.value)}
                        className="border text-xs px-2 py-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center">
          <div className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-gray-900 shadow-sm border rounded-lg px-2 sm:px-4 py-2 overflow-x-auto">
            
            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
              Prev
            </button>

            {/* First page */}
            <button
              onClick={() => setPage(1)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                page === 1
                  ? "bg-orange-600 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-orange-100"
              }`}
            >
              1
            </button>

            {/* Left dots */}
            {page > 3 && <span className="px-1 sm:px-2 text-gray-500">…</span>}

            {/* Middle pages (current ±1) */}
            {Array.from({ length: 3 }, (_, i) => page - 1 + i)
              .filter((p) => p > 1 && p < totalPages)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                    page === p
                      ? "bg-orange-600 text-white shadow"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-orange-100"
                  }`}
                >
                  {p}
                </button>
              ))}

            {/* Right dots */}
            {page < totalPages - 2 && <span className="px-1 sm:px-2 text-gray-500">…</span>}

            {/* Last page */}
            {totalPages > 1 && (
              <button
                onClick={() => setPage(totalPages)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                  page === totalPages
                    ? "bg-orange-600 text-white shadow"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-orange-100"
                }`}
              >
                {totalPages}
              </button>
            )}

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
