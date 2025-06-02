// 'use client';

// import React from "react";
// import { assets } from "@/assets/assets";
// import OrderSummary from "@/components/OrderSummary";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";

// const Cart = () => {
//   const {
//     products,
//     router,
//     cartItems,
//     addToCart,
//     updateCartQuantity,
//     getCartCount,
//   } = useAppContext();

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mt-10 mb-20">
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
//             <p className="text-2xl md:text-3xl text-gray-500">
//               My <span className="font-medium text-orange-600">Cart</span>
//             </p>
//             <p className="text-lg md:text-xl text-gray-500/80">
//               {getCartCount()} Items
//             </p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead className="text-left">
//                 <tr>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Product Details</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(cartItems).map((itemId) => {
//                   const product = products.find((p) => p._id === itemId);
//                   if (!product || cartItems[itemId] <= 0) return null;

//                   return (
//                     <tr key={itemId}>
//                       <td className="flex items-center gap-4 py-4 md:px-4 px-1">
//                         <div>
//                           <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
//                             <Image
//                               src={product.image[0]}
//                               alt={product.name}
//                               className="w-16 h-auto object-cover mix-blend-multiply"
//                               width={1280}
//                               height={720}
//                             />
//                           </div>
//                           <button
//                             className="md:hidden text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                         <div className="text-sm hidden md:block">
//                           <p className="text-gray-800">{product.name}</p>
//                           <button
//                             className="text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         ${product.offerPrice}
//                       </td>

//                       <td className="py-4 md:px-4 px-1">
//                         <div className="flex items-center md:gap-2 gap-1">
//                           <button
//                             onClick={() =>
//                               updateCartQuantity(product._id, cartItems[itemId] - 1)
//                             }
//                           >
//                             <Image
//                               src={assets.decrease_arrow}
//                               alt="decrease_arrow"
//                               className="w-4 h-4"
//                             />
//                           </button>

//                           <input
//                             type="number"
//                             value={cartItems[itemId]}
//                             onChange={(e) =>
//                               updateCartQuantity(
//                                 product._id,
//                                 Number(e.target.value)
//                               )
//                             }
//                             className="w-8 border text-center appearance-none"
//                           />

//                           <button onClick={() => addToCart(product)}>
//                             <Image
//                               src={assets.increase_arrow}
//                               alt="increase_arrow"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         </div>
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={() => router.push("/all-products")}
//             className="group flex items-center mt-6 gap-2 text-orange-600"
//           >
//             <Image
//               className="group-hover:-translate-x-1 transition"
//               src={assets.arrow_right_icon_colored}
//               alt="arrow_right_icon_colored"
//             />
//             Continue Shopping
//           </button>
//         </div>

//         <OrderSummary />
//       </div>
//     <Footer />

//     </>
//   );
// };

// export default Cart;


































































// // components/Cart.js
// 'use client'
// import React from "react";
// import { assets } from "@/assets/assets";
// import OrderSummary from "@/components/OrderSummary";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";

// const Cart = () => {
//   const {
//     products,
//     router,
//     cartItems,
//     addToCart,
//     updateCartQuantity,
//     getCartCount,
//   } = useAppContext();

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mt-10 mb-20">
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
//             <p className="text-2xl md:text-3xl text-gray-500">
//               My <span className="font-medium text-orange-600">Cart</span>
//             </p>
//             <p className="text-lg md:text-xl text-gray-500/80">
//               {getCartCount()} Items
//             </p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead className="text-left">
//                 <tr>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Product Details</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(cartItems).map((itemId) => {
//                   const product = products.find((p) => p._id === itemId);
//                   if (!product || cartItems[itemId] <= 0) return null;

//                   const maxQuantity = product.stock;
//                   const currentQuantity = cartItems[itemId];

//                   return (
//                     <tr key={itemId}>
//                       <td className="flex items-center gap-4 py-4 md:px-4 px-1">
//                         <div>
//                           <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
//                             <Image
//                               src={product.image[0]}
//                               alt={product.name}
//                               className="w-16 h-auto object-cover mix-blend-multiply"
//                               width={1280}
//                               height={720}
//                             />
//                           </div>
//                           <button
//                             className="md:hidden text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                         <div className="text-sm hidden md:block">
//                           <p className="text-gray-800">{product.name}</p>
//                           <button
//                             className="text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         ${product.offerPrice}
//                       </td>

//                       <td className="py-4 md:px-4 px-1">
//                         <div className="flex items-center md:gap-2 gap-1">
//                           <button
//                             onClick={() =>
//                               updateCartQuantity(product._id, currentQuantity - 1)
//                             }
//                             disabled={currentQuantity <= 1}
//                           >
//                             <Image
//                               src={assets.decrease_arrow}
//                               alt="decrease_arrow"
//                               className="w-4 h-4"
//                             />
//                           </button>

//                           <input
//                             type="number"
//                             value={currentQuantity}
//                             onChange={(e) => {
//                               const value = Number(e.target.value);
//                               if (value > 0 && value <= maxQuantity) {
//                                 updateCartQuantity(product._id, value);
//                               }
//                             }}
//                             className="w-8 border text-center appearance-none"
//                           />

//                           <button
//                             onClick={() => {
//                               if (currentQuantity < maxQuantity) {
//                                 updateCartQuantity(product._id, currentQuantity + 1);
//                               }
//                             }}
//                             disabled={currentQuantity >= maxQuantity}
//                           >
//                             <Image
//                               src={assets.increase_arrow}
//                               alt="increase_arrow"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         </div>
//                         {currentQuantity >= maxQuantity && (
//                           <p className="text-xs text-red-500 mt-1">
//                             Maximum available stock reached
//                           </p>
//                         )}
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         ${(product.offerPrice * currentQuantity).toFixed(2)}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={() => router.push("/all-products")}
//             className="group flex items-center mt-6 gap-2 text-orange-600"
//           >
//             <Image
//               className="group-hover:-translate-x-1 transition"
//               src={assets.arrow_right_icon_colored}
//               alt="arrow_right_icon_colored"
//             />
//             Continue Shopping
//           </button>
//         </div>

//         <OrderSummary />
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;



























































// 'use client';
// import React, { useEffect } from "react";
// import { assets } from "@/assets/assets";
// import OrderSummary from "@/components/OrderSummary";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/Footer";

// const Cart = () => {
//   const {
//     products,
//     router,
//     cartItems,
//     addToCart,
//     updateCartQuantity,
//     getCartCount,
//   } = useAppContext();

//   // 🆕 Sync cart to backend API
//   useEffect(() => {
//     const syncCart = async () => {
//       const cartData = Object.entries(cartItems).map(([productId, quantity]) => ({
//         productId,
//         quantity,
//       }));

//       try {
//         const res = await fetch("/api/cart/update", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ cartData }),
//         });

//         const result = await res.json();
//         if (!res.ok) {
//           console.error("Cart sync failed:", result.message);
//         } else {
//           console.log("Cart synced successfully");
//         }
//       } catch (error) {
//         console.error("Error syncing cart:", error.message);
//       }
//     };

//     if (Object.keys(cartItems).length > 0) {
//       syncCart();
//     }
//   }, [cartItems]);

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mt-10 mb-20">
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
//             <p className="text-2xl md:text-3xl text-gray-500">
//               My <span className="font-medium text-orange-600">Cart</span>
//             </p>
//             <p className="text-lg md:text-xl text-gray-500/80">
//               {getCartCount()} Items
//             </p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead className="text-left">
//                 <tr>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Product Details</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
//                   <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(cartItems).map((itemId) => {
//                   const product = products.find((p) => p._id === itemId);
//                   if (!product || cartItems[itemId] <= 0) return null;

//                   const maxQuantity = product.stock;
//                   const currentQuantity = cartItems[itemId];

//                   return (
//                     <tr key={itemId}>
//                       <td className="flex items-center gap-4 py-4 md:px-4 px-1">
//                         <div>
//                           <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
//                             <Image
//                               src={product.image[0]}
//                               alt={product.name}
//                               className="w-16 h-auto object-cover mix-blend-multiply"
//                               width={1280}
//                               height={720}
//                             />
//                           </div>
//                           <button
//                             className="md:hidden text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                         <div className="text-sm hidden md:block">
//                           <p className="text-gray-800">{product.name}</p>
//                           <button
//                             className="text-xs text-orange-600 mt-1"
//                             onClick={() => updateCartQuantity(product._id, 0)}
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         ${product.offerPrice}
//                       </td>

//                       <td className="py-4 md:px-4 px-1">
//                         <div className="flex items-center md:gap-2 gap-1">
//                           <button
//                             onClick={() =>
//                               updateCartQuantity(product._id, currentQuantity - 1)
//                             }
//                             disabled={currentQuantity <= 1}
//                           >
//                             <Image
//                               src={assets.decrease_arrow}
//                               alt="decrease_arrow"
//                               className="w-4 h-4"
//                             />
//                           </button>

//                           <input
//                             type="number"
//                             value={currentQuantity}
//                             onChange={(e) => {
//                               const value = Number(e.target.value);
//                               if (value > 0 && value <= maxQuantity) {
//                                 updateCartQuantity(product._id, value);
//                               }
//                             }}
//                             className="w-8 border text-center appearance-none"
//                           />

//                           <button
//                             onClick={() => {
//                               if (currentQuantity < maxQuantity) {
//                                 updateCartQuantity(product._id, currentQuantity + 1);
//                               }
//                             }}
//                             disabled={currentQuantity >= maxQuantity}
//                           >
//                             <Image
//                               src={assets.increase_arrow}
//                               alt="increase_arrow"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         </div>
//                         {currentQuantity >= maxQuantity && (
//                           <p className="text-xs text-red-500 mt-1">
//                             Maximum available stock reached
//                           </p>
//                         )}
//                       </td>

//                       <td className="py-4 md:px-4 px-1 text-gray-600">
//                         ${(product.offerPrice * currentQuantity).toFixed(2)}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={() => router.push("/all-products")}
//             className="group flex items-center mt-6 gap-2 text-orange-600"
//           >
//             <Image
//               className="group-hover:-translate-x-1 transition"
//               src={assets.arrow_right_icon_colored}
//               alt="arrow_right_icon_colored"
//             />
//             Continue Shopping
//           </button>
//         </div>

//         <OrderSummary />
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Cart;
















































































































































'use client';

import React, { useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import toast from 'react-hot-toast';


const Cart = () => {
  const {
    products,
    router,
    cartItems,
    updateCartQuantity,
    getCartCount,
  } = useAppContext();

  // useEffect(() => {
  //   const syncCart = async () => {
  //     const cartData = Object.entries(cartItems).map(([productId, quantity]) => ({
  //       productId,
  //       quantity,
  //     }));

  //     try {
  //       const res = await fetch("/api/cart/update", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ cartData }),
  //       });

  //       if (!res.ok) {
  //         // Attempt to parse error JSON safely
  //         const errorData = await res.json().catch(() => ({}));
  //         toast.error(`Cart sync failed: ${errorData.message || res.statusText}`);
  //         console.error("Cart sync failed:", errorData.message || res.statusText);
  //         return;
  //       }

  //       const result = await res.json();
  //       toast.success(result.message || "Cart synced successfully");
  //       console.log("Cart synced successfully", result);
  //     } catch (error) {
  //       // toast.error(`Error syncing cart: ${error.message}`);
  //       console.error("Error syncing cart:", error);
  //     }
  //   };

  //   if (Object.keys(cartItems).length > 0) {
  //     syncCart();
  //   }
  // }, [cartItems]);

  useEffect(() => {
    const syncCart = async () => {
      const cartData = Object.entries(cartItems).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

      try {
        const res = await fetch("/api/cart/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartData }),
        });

        const result = await res.json();
        if (!res.ok) {
          console.error("Cart sync failed:", result.message);
        } else {
          console.log("Cart synced successfully");
        }
      } catch (error) {
        console.error("Error syncing cart:", error.message);
      }
    };

    if (Object.keys(cartItems).length > 0) {
      syncCart();
    }
  }, [cartItems]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mt-10 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              My <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {getCartCount()} Items
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Product Details</th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Price</th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Quantity</th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find((p) => p._id === itemId);
                  if (!product || cartItems[itemId] <= 0) return null;

                  const maxQuantity = product.stock;
                  const currentQuantity = cartItems[itemId];

                  return (
                    <tr key={itemId}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{product.name}</p>
                          <button
                            className="text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>

                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        ${product.offerPrice}
                      </td>

                      <td className="py-4 md:px-4 px-1">
                        {maxQuantity === 0 ? (
                          <p className="text-red-500 font-semibold">Sold Out</p>
                        ) : (
                          <div className="flex items-center md:gap-2 gap-1">
                            <button
                              onClick={() => updateCartQuantity(product._id, currentQuantity - 1)}
                              disabled={currentQuantity <= 1}
                            >
                              <Image
                                src={assets.decrease_arrow}
                                alt="decrease_arrow"
                                className="w-4 h-4"
                              />
                            </button>

                            <input
                              type="number"
                              value={currentQuantity}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value > 0 && value <= maxQuantity) {
                                  updateCartQuantity(product._id, value);
                                }
                              }}
                              className="w-8 border text-center appearance-none"
                            />

                            <button
                              onClick={() => {
                                if (currentQuantity < maxQuantity) {
                                  updateCartQuantity(product._id, currentQuantity + 1);
                                }
                              }}
                              disabled={currentQuantity >= maxQuantity}
                            >
                              <Image
                                src={assets.increase_arrow}
                                alt="increase_arrow"
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        )}
                        {currentQuantity >= maxQuantity && maxQuantity > 0 && (
                          <p className="text-xs text-red-500 mt-1">Maximum stock reached</p>
                        )}
                      </td>

                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        ${(product.offerPrice * currentQuantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-6 gap-2 text-orange-600"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>

        <OrderSummary />
      </div>
      <Footer />
    </>
  );
};

export default Cart;
