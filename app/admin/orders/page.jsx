// 'use client';
// import React, { useEffect, useState } from "react";
// import { assets, orderDummyData } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/admin/Footer";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Orders = () => {

//     const { currency, getToken, user } = useAppContext();

//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchAdminOrders = async () => {
//         try {
            
//             const token = await getToken()

//             const { data } = await axios.get(
//                 '/api/order/admin-orders', 
//                 { 
//                     headers : { Authorization : `Bearer ${token}` } 
//                 }
//             )

//             if (data.success) {
//                 setOrders(data.orders)
//                 setLoading(false)
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     useEffect(() => {
//         if (user) {
//             fetchAdminOrders();
//         }
//     }, [user]);

//     return (
//         <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
//             {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
//                 <h2 className="text-lg font-medium">Orders</h2>
//                 <div className="max-w-4xl rounded-md">
//                     {orders.map((order, index) => (
//                         <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
//                             <div className="flex-1 flex gap-5 max-w-80">
//                                 <Image
//                                     className="max-w-16 max-h-16 object-cover"
//                                     src={assets.box_icon}
//                                     alt="box_icon"
//                                 />
//                                 <p className="flex flex-col gap-3">
//                                     <span className="font-medium">
//                                         {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
//                                     </span>
//                                     <span>Items : {order.items.length}</span>
//                                 </p>
//                             </div>
//                             <div>
//                                 <p>
//                                     <span className="font-medium">{order.address.fullName}</span>
//                                     <br />
//                                     <span >{order.address.area}</span>
//                                     <br />
//                                     <span>{`${order.address.city}, ${order.address.state}`}</span>
//                                     <br />
//                                     <span>{order.address.phoneNumber}</span>
//                                 </p>
//                             </div>
//                             <p className="font-medium my-auto">{currency}{order.amount}</p>
//                             <div>
//                                 <p className="flex flex-col">
//                                     <span>Method : COD</span>
//                                     <span>Date : {new Date(order.date).toLocaleDateString()}</span>
//                                     <span>Payment : Pending</span>
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>}
//             <Footer />
//         </div>
//     );
// };

// export default Orders;











// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/admin/Footer";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { assets } from "@/assets/assets";

// const Orders = () => {
//   const { currency, getToken, user } = useAppContext();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingOrderId, setUpdatingOrderId] = useState(null);

//   const fetchAdminOrders = async () => {
//     try {
//       const token = await getToken();

//       const { data } = await axios.get("/api/order/admin-orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         setOrders(data.orders);
//         setLoading(false);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       setUpdatingOrderId(orderId);
//       const token = await getToken();

//       const { data } = await axios.patch(
//         "/api/order/update-status",
//         { orderId, status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success("Order status updated");
//         // Update local state
//         setOrders((prev) =>
//           prev.map((order) => (order._id === orderId ? { ...order, status } : order))
//         );
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setUpdatingOrderId(null);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchAdminOrders();
//     }
//   }, [user]);

//   const statusOptions = [
//     "Order Placed",
//     "Approved",
//     "Dispatched",
//     "Delivered",
//     "Cancelled",
//   ];

//   return (
//     <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="md:p-10 p-4 space-y-5">
//           <h2 className="text-lg font-medium">Orders</h2>
//           <div className="max-w-4xl rounded-md">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
//               >
//                 <div className="flex-1 flex gap-5 max-w-80">
//                   <Image
//                     className="max-w-16 max-h-16 object-cover"
//                     src={assets.box_icon}
//                     alt="box_icon"
//                     width={64}
//                     height={64}
//                   />
//                   <p className="flex flex-col gap-3">
//                     <span className="font-medium">
//                       {order.items
//                         .map((item) => item.product.name + ` x ${item.quantity}`)
//                         .join(", ")}
//                     </span>
//                     <span>Items : {order.items.length}</span>
//                   </p>
//                 </div>
//                 <div>
//                   <p>
//                     <span className="font-medium">{order.address.fullName}</span>
//                     <br />
//                     <span>{order.address.area}</span>
//                     <br />
//                     <span>{`${order.address.city}, ${order.address.state}`}</span>
//                     <br />
//                     <span>{order.address.phoneNumber}</span>
//                   </p>
//                 </div>
//                 <p className="font-medium my-auto">
//                   {currency}
//                   {order.amount}
//                 </p>
//                 <div>
//                   <p className="flex flex-col mb-2">
//                     <span>Method : COD</span>
//                     <span>Date : {new Date(order.date).toLocaleDateString()}</span>
//                     <span>Payment : Pending</span>
//                   </p>

//                   {/* Order status dropdown */}
//                   <select
//                     value={order.status}
//                     disabled={updatingOrderId === order._id}
//                     onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                     className="border border-gray-300 rounded p-1"
//                   >
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default Orders;







// 'use client';
// import React, { useEffect, useState } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/admin/Footer";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Orders = () => {
//   const { currency, getToken, user } = useAppContext();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAdminOrders = async () => {
//     try {
//       const token = await getToken();

//       const { data } = await axios.get('/api/order/admin-orders', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         setOrders(data.orders);
//         setLoading(false);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchAdminOrders();
//     }
//   }, [user]);

//   return (
//     <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="md:p-10 p-4 space-y-5">
//           <h2 className="text-lg font-medium">Orders</h2>
//           <div className="max-w-4xl rounded-md">
//             {orders.map((order, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
//               >
//                 <div className="flex-1 flex gap-5 max-w-80">
//                   <Image
//                     className="max-w-16 max-h-16 object-cover"
//                     src={assets.box_icon}
//                     alt="box_icon"
//                     width={64}
//                     height={64}
//                   />
//                   <p className="flex flex-col gap-3">
//                     <span className="font-medium">
//                       {order.items
//                         .map(
//                           (item) =>
//                             (item.product ? item.product.name : "Unknown product") +
//                             ` x ${item.quantity}`
//                         )
//                         .join(", ")}
//                     </span>
//                     <span>Items : {order.items.length}</span>
//                   </p>
//                 </div>
//                 <div>
//                   <p>
//                     <span className="font-medium">{order.address?.fullName || "No Name"}</span>
//                     <br />
//                     <span>{order.address?.area || "No Area"}</span>
//                     <br />
//                     <span>
//                       {order.address
//                         ? `${order.address.city || "No City"}, ${order.address.state || "No State"}`
//                         : "No City/State"}
//                     </span>
//                     <br />
//                     <span>{order.address?.phoneNumber || "No Phone"}</span>
//                   </p>
//                 </div>
//                 <p className="font-medium my-auto">
//                   {currency}
//                   {order.amount}
//                 </p>
//                 <div>
//                   <p className="flex flex-col">
//                     <span>Method : COD</span>
//                     <span>Date : {new Date(order.date).toLocaleDateString()}</span>
//                     <span>Payment : Pending</span>
//                     <span>Status : {order.status || "Order Placed"}</span>
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default Orders;












'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import Footer from "@/components/admin/Footer";
import { assets } from "@/assets/assets";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/admin-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/order/update-status", { orderId, status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Status updated");
        fetchAdminOrders(); // Refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchAdminOrders();
  }, [user]);

  return (
    <div className="flex-1 overflow-scroll h-screen text-sm flex flex-col justify-between">
      {loading ? <Loading /> : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">All User Orders</h2>
          <div className="max-w-4xl space-y-5">
            {orders.map((order, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border border-gray-300 rounded">
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image className="w-16 h-16 object-cover" src={assets.box_icon} alt="box" />
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-base">
                      {order.items.map(item => (
                        `${item?.product?.name || "Unknown"} x ${item.quantity}`
                      )).join(", ")}
                    </span>
                    <span>Items: {order.items.length}</span>
                  </div>
                </div>
                <div>
                  <p>
                    <span className="font-medium">{order.address?.fullName}</span><br />
                    {order.address?.area}<br />
                    {`${order.address?.city}, ${order.address?.state}`}<br />
                    {order.address?.phoneNumber}
                  </p>
                </div>
                <p className="font-medium my-auto">{currency}{order.amount}</p>
                <div>
                  <p className="flex flex-col">
                    <span>Method: COD</span>
                    <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                    <span>Status: {order.status}</span>
                    <select
                      className="mt-1 p-1 text-sm border rounded"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option>Order Placed</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
