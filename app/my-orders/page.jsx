// 'use client';
// import React, { useEffect, useState } from "react";
// import { assets, orderDummyData } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";

// const MyOrders = () => {

//     const { currency,getToken, user } = useAppContext();

//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchOrders = async () => {
//         try {
            
//             const token = await getToken()

//             const { data } = await axios.get('/api/order/list', { headers : {Authorization : `Bearer ${token}` }})

//             if (data.success) {
//                 setOrders(data.orders.reverse())
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
//         fetchOrders();
//         }
//     }, [user]);

//     return (
//         <>
//             <Navbar />
//             <div className="flex flex-col justify-between mt-16 px-6 md:px-16 lg:px-32 py-6 min-h-screen">
//                 <div className="space-y-5">
//                     <h2 className="text-lg font-medium mt-6">My Orders</h2>
//                     {loading ? <Loading /> : (<div className="max-w-5xl border-t border-gray-300 text-sm">
//                         {orders.map((order, index) => (
//                             <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
//                                 <div className="flex-1 flex gap-5 max-w-80">
//                                     <Image
//                                         className="max-w-16 max-h-16 object-cover"
//                                         src={assets.box_icon}
//                                         alt="box_icon"
//                                     />
//                                     <p className="flex flex-col gap-3">
//                                         <span className="font-medium text-base">
//                                             {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
//                                         </span>
//                                         <span>Items : {order.items.length}</span>
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p>
//                                         <span className="font-medium">{order.address.fullName}</span>
//                                         <br />
//                                         <span >{order.address.area}</span>
//                                         <br />
//                                         <span>{`${order.address.city}, ${order.address.state}`}</span>
//                                         <br />
//                                         <span>{order.address.phoneNumber}</span>
//                                     </p>
//                                 </div>
//                                 <p className="font-medium my-auto">{currency}{order.amount}</p>
//                                 <div>
//                                     <p className="flex flex-col">
//                                         <span>Method : COD</span>
//                                         <span>Date : {new Date(order.date).toLocaleDateString()}</span>
//                                         <span>Payment : Pending</span>
//                                         <span>Status: {order.status}</span>  {/* <-- Add this line */}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>)}
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default MyOrders;








// 'use client';
// import React, { useEffect, useState } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";

// const MyOrders = () => {
//   const { currency, getToken, user } = useAppContext();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get('/api/order/list', {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (data.success) {
//         setOrders(data.orders.reverse());
//         setLoading(false);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Handler to cancel order
//   const handleCancelOrder = async (orderId) => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.post(
//         "/api/order/update-status",
//         { orderId, status: "Cancelled" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success("Order cancelled");
//         fetchOrders(); // Refresh orders after cancel
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchOrders();
//     }
//   }, [user]);

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col justify-between mt-16 px-6 md:px-16 lg:px-32 py-6 min-h-screen">
//         <div className="space-y-5">
//           <h2 className="text-lg font-medium mt-6">My Orders</h2>
//           {loading ? (
//             <Loading />
//           ) : (
//             <div className="max-w-5xl border-t border-gray-300 text-sm">
//               {orders.map((order, index) => (
//                 <div
//                   key={index}
//                   className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
//                 >
//                   <div className="flex-1 flex gap-5 max-w-80">
//                     <Image
//                       className="max-w-16 max-h-16 object-cover"
//                       src={assets.box_icon}
//                       alt="box_icon"
//                       width={64}
//                       height={64}
//                     />
//                     <p className="flex flex-col gap-3">
//                       <span className="font-medium text-base">
//                         {order.items
//                           .map((item) => item.product.name + ` x ${item.quantity}`)
//                           .join(", ")}
//                       </span>
//                       <span>Items : {order.items.length}</span>
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <span className="font-medium">{order.address.fullName}</span>
//                       <br />
//                       <span>{order.address.area}</span>
//                       <br />
//                       <span>{`${order.address.city}, ${order.address.state}`}</span>
//                       <br />
//                       <span>{order.address.phoneNumber}</span>
//                     </p>
//                   </div>
//                   <p className="font-medium my-auto">{currency}{order.amount}</p>
//                   <div>
//                     <p className="flex flex-col">
//                       <span>Method : COD</span>
//                       <span>Date : {new Date(order.date).toLocaleDateString()}</span>
//                       <span>Payment : Pending</span>
//                       <span>Status: {order.status}</span>
//                     </p>
//                     {/* Cancel button, show only if order not Delivered or Cancelled */}
//                     {order.status !== "Delivered" && order.status !== "Cancelled" && (
//                       <button
//                         onClick={() => handleCancelOrder(order._id)}
//                         className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded"
//                       >
//                         Cancel Order
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default MyOrders;


















// 'use client';
// import React, { useEffect, useState } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";

// const MyOrders = () => {
//   const { currency, getToken, user } = useAppContext();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get('/api/order/list', {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (data.success) {
//         setOrders(data.orders.reverse());
//         setLoading(false);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Handler to cancel order
//   const handleCancelOrder = async (orderId) => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.post(
//         "/api/order/cancel",
//         { orderId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success("Order cancelled");
//         fetchOrders(); // refresh list after cancel
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchOrders();
//     }
//   }, [user]);

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col justify-between mt-16 px-6 md:px-16 lg:px-32 py-6 min-h-screen">
//         <div className="space-y-5">
//           <h2 className="text-lg font-medium mt-6">My Orders</h2>
//           {loading ? (
//             <Loading />
//           ) : (
//             <div className="max-w-5xl border-t border-gray-300 text-sm">
//               {orders.map((order, index) => (
//                 <div
//                   key={index}
//                   className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
//                 >
//                   <div className="flex-1 flex gap-5 max-w-80">
//                     <Image
//                       className="max-w-16 max-h-16 object-cover"
//                       src={assets.box_icon}
//                       alt="box_icon"
//                       width={64}
//                       height={64}
//                     />
//                     <p className="flex flex-col gap-3">
//                       <span className="font-medium text-base">
//                         {order.items
//                           .map((item) => item.product.name + ` x ${item.quantity}`)
//                           .join(", ")}
//                       </span>
//                       <span>Items : {order.items.length}</span>
//                     </p>
//                   </div>
//                   <div>
//                     <p>
//                       <span className="font-medium">{order.address.fullName}</span>
//                       <br />
//                       <span>{order.address.area}</span>
//                       <br />
//                       <span>{`${order.address.city}, ${order.address.state}`}</span>
//                       <br />
//                       <span>{order.address.phoneNumber}</span>
//                     </p>
//                   </div>
//                   <p className="font-medium my-auto">{currency}{order.amount}</p>
//                   <div>
//                     <p className="flex flex-col">
//                       <span>Method : COD</span>
//                       <span>Date : {new Date(order.date).toLocaleDateString()}</span>
//                       <span>Payment : Pending</span>
//                       <span>Status: {order.status}</span>
//                     </p>
//                     {/* Cancel button, show only if order not Delivered or Cancelled */}
//                     {order.status !== "Delivered" && order.status !== "Cancelled" && (
//                       <button
//                         onClick={() => handleCancelOrder(order._id)}
//                         className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded"
//                       >
//                         Cancel Order
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default MyOrders;












'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/order/list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setOrders(data.orders.reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/cancel",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Order cancelled");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/delete",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Order deleted");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between mt-16 px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                >
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                      width={64}
                      height={64}
                    />
                    <p className="flex flex-col gap-3">
                      <span className="font-medium text-base">
                        {order.items
                          .map((item) => item.product.name + ` x ${item.quantity}`)
                          .join(", ")}
                      </span>
                      <span>Items : {order.items.length}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">{order.address.fullName}</span>
                      <br />
                      <span>{order.address.area}</span>
                      <br />
                      <span>{`${order.address.city}, ${order.address.state}`}</span>
                      <br />
                      <span>{order.address.phoneNumber}</span>
                    </p>
                  </div>
                  <p className="font-medium my-auto">{currency}{order.amount}</p>
                  <div>
                    <p className="flex flex-col">
                      <span>Method : COD</span>
                      <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                      <span>Payment : Pending</span>
                      <span>Status: {order.status}</span>
                    </p>
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded"
                      >
                        Cancel Order
                      </button>
                    )}
                    {order.status === "Cancelled" && (
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="mt-2 px-3 py-1 text-sm bg-gray-700 text-white rounded"
                      >
                        Delete Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
