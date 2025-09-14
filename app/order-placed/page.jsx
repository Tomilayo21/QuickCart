'use client';

import { useAppContext } from '@/context/AppContext';
import { useAuth } from "@clerk/nextjs";
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingCart, CheckCircle, XCircle, PartyPopper } from "lucide-react";



const OrderPlaced = () => {
  const { setCartItems, router } = useAppContext();
  const { getToken } = useAuth(); 

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
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      
      {/* Checkmark animation */}
      <div className="relative flex justify-center items-center mb-6">
        <div className="animate-spin rounded-full h-28 w-28 border-4 border-t-orange-400 border-gray-200 dark:border-neutral-700"></div>
        <CheckCircle className="absolute h-12 w-12 sm:h-14 sm:w-14 text-orange-500" />
      </div>

      {/* Text */}
      <div className="flex items-center gap-2 justify-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Order Placed Successfully
        </h1>
        <PartyPopper className="w-6 h-6 text-orange-500" />
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <a
          href="/my-orders"
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md transition text-center"
        >
          View My Orders
        </a>
        <a
          href="/all-products"
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 font-medium shadow-sm transition text-center"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );

};

export default OrderPlaced;
