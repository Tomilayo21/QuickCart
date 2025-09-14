// 'use client'
// import { assets } from '@/assets/assets'
// import { useAppContext } from '@/context/AppContext'
// import Image from 'next/image'
// import { useEffect } from 'react'

// const OrderPlaced = () => {

//   const { router } = useAppContext()

//   useEffect(() => {
//     setTimeout(() => {
//       router.push('/my-orders')
//     }, 5000)
//   }, [])

//   return (
//     <div className='h-screen flex flex-col justify-center items-center gap-5'>
//       <div className="flex justify-center items-center relative">
//         <Image className="absolute p-5" src={assets.checkmark} alt='' />
//         <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
//       </div>
//       <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
//     </div>
//   )
// }

// export default OrderPlaced





//......................................................................................
'use client';

import { useAppContext } from '@/context/AppContext';
import { useAuth } from "@clerk/nextjs";
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";


const OrderPlaced = () => {
  const { setCartItems, router } = useAppContext();
  const { getToken } = useAuth(); 

  // useEffect(() => {
  //   const finalizeOrder = async () => {
  //     const pending = sessionStorage.getItem("pendingOrder");

  //     if (!pending) {
  //       toast.error("No pending order data found");
  //       return;
  //     }

  //     try {
  //       const token = await getToken();
  //       console.log("Clerk token:", token); // ✅ Debug log added here

  //       if (!token) {
  //         toast.error("No auth token found. Please sign in again.");
  //         return;
  //       }

  //       const orderData = JSON.parse(pending);

  //       const res = await axios.post("/api/order/create", {
  //         address: orderData.addressId,
  //         items: orderData.items,
  //         paymentMethod: orderData.paymentMethod,
  //       }, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (!res.data.success) {
  //         toast.error("Order creation failed");
  //       } else {
  //         toast.success("Order successfullys created");
  //         setCartItems({});
  //         sessionStorage.removeItem("pendingOrder");
  //       }
  //     } catch (error) {
  //       console.error("Finalize Order Error:", error);
  //       toast.error("Failed to finalize order: " + (error.message || "Unknown error"));
  //     }
  //   };

  //   finalizeOrder();

  //   // const timer = setTimeout(() => {
  //   //   router.push('/my-orders');
  //   // }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);


  

useEffect(() => {
  const finalizeOrder = async () => {
    const pending = sessionStorage.getItem("pendingOrder");

    if (!pending) {
      toast.custom(
        (t) => (
          <div
            className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
              transform transition-all duration-300 ease-in-out
              ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            <XCircle className="text-red-500" size={20} />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              No pending order data found
            </p>
          </div>
        ),
        { duration: 2500, position: "top-right" }
      );
      return;
    }

    try {
      const token = await getToken();
      console.log("Clerk token:", token);

      if (!token) {
        toast.custom(
          (t) => (
            <div
              className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
                transform transition-all duration-300 ease-in-out
                ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <XCircle className="text-red-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                No auth token found. Please sign in again.
              </p>
            </div>
          ),
          { duration: 2500, position: "top-right" }
        );
        return;
      }

      const orderData = JSON.parse(pending);

      const res = await axios.post(
        "/api/order/create",
        {
          address: orderData.addressId,
          items: orderData.items,
          paymentMethod: orderData.paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.success) {
        toast.custom(
          (t) => (
            <div
              className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
                transform transition-all duration-300 ease-in-out
                ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <XCircle className="text-red-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Order creation failed
              </p>
            </div>
          ),
          { duration: 2500, position: "top-right" }
        );
      } else {
        toast.custom(
          (t) => (
            <div
              className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
                transform transition-all duration-300 ease-in-out
                ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Order successfully created
              </p>
            </div>
          ),
          { duration: 2500, position: "top-right" }
        );
        setCartItems({});
        sessionStorage.removeItem("pendingOrder");
      }
    } catch (error) {
      console.error("Finalize Order Error:", error);
      toast.custom(
        (t) => (
          <div
            className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
              transform transition-all duration-300 ease-in-out
              ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            <XCircle className="text-red-500" size={20} />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Failed to finalize order: {error.message || "Unknown error"}
            </p>
          </div>
        ),
        { duration: 3000, position: "top-right" }
      );
    }
  };

  finalizeOrder();

  // const timer = setTimeout(() => {
  //   router.push('/my-orders');
  // }, 1000);

  return () => clearTimeout(timer);
}, []);


  return (
    // <div className='h-screen flex flex-col justify-center items-center gap-5'>
    //   <div className="flex justify-center items-center relative">
    //     <Image className="absolute p-5" src={assets.checkmark} alt='' />
    //     <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
    //   </div>
    //   <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
    // </div>

    <div className="h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Checkmark animation */}
      <div className="relative flex justify-center items-center mb-6">
        <div className="animate-spin rounded-full h-28 w-28 border-4 border-t-green-400 border-gray-200 dark:border-neutral-700"></div>
        <Image
          src={assets.checkmark}
          alt="Success"
          className="absolute h-14 w-14 p-2 animate-bounce"
        />
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Order Placed Successfully 🎉
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
          Thank you for your purchase! Your order is being processed.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 flex gap-4">
        <a
          href="/my-orders"
          className="px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow-md transition"
        >
          View My Orders
        </a>
        <a
          href="/all-products"
          className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 font-medium shadow-sm transition"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
};

export default OrderPlaced;
//................................................................................................







































































// 'use client'
// import { assets } from '@/assets/assets'
// import { useAppContext } from '@/context/AppContext'
// import Image from 'next/image'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useAuth } from '@clerk/nextjs'

// const OrderPlaced = () => {
//   const { router, setCartItems } = useAppContext()
//   const { getToken } = useAuth()
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const createOrderAfterStripe = async () => {
//       const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder") || "null")
//       if (!pendingOrder) {
//         toast.error("No order data found")
//         setLoading(false)
//         return
//       }

//       try {
//         const token = await getToken()
//         const res = await axios.post('/api/order/create', pendingOrder, {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         if (!res.data.success) {
//           toast.error(res.data.message || "Order creation failed")
//         } else {
//           toast.success("Order successfully created")
//           localStorage.removeItem("pendingOrder")
//           setCartItems({})
//         }
//       } catch (error) {
//         toast.error(error.message || "Failed to create order after Stripe")
//       } finally {
//         setLoading(false)
//       }
//     }

//     createOrderAfterStripe()

//     const timeout = setTimeout(() => {
//       router.push('/my-orders')
//     }, 5000)

//     return () => clearTimeout(timeout)
//   }, [])

//   return (
//     <div className='h-screen flex flex-col justify-center items-center gap-5'>
//       <div className="flex justify-center items-center relative">
//         <Image className="absolute p-5" src={assets.checkmark} alt='' />
//         <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
//       </div>
//       <div className="text-center text-2xl font-semibold">
//         {loading ? 'Placing your order...' : 'Order Placed Successfully'}
//       </div>
//     </div>
//   )
// }

// export default OrderPlaced
