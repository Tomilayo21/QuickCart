// 'use client'

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import Footer from "@/components/admin/Footer";
// import Loading from "@/components/Loading";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { assets } from "@/assets/assets";

// const ProductList = () => {
//   const { router, getToken, user } = useAppContext();

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAdminProduct = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get("/api/product/admin-list", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         setProducts(data.products);
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
//       fetchAdminProduct();
//     }
//   }, [user]);

//   return (
//     <div className="flex-1 min-h-screen flex flex-col justify-between">
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="w-full md:p-10 p-4">
//           <h2 className="pb-4 text-lg font-medium">All Product</h2>
//           <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
//             <table className="table-fixed w-full overflow-hidden">
//               <thead className="text-gray-900 text-sm text-left">
//                 <tr>
//                   <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
//                     Product
//                   </th>
//                   <th className="px-4 py-3 font-medium truncate max-sm:hidden">
//                     Category
//                   </th>
//                   <th className="px-4 py-3 font-medium truncate">Price</th>
//                   <th className="px-4 py-3 font-medium truncate max-sm:hidden">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm text-gray-500">
//                 {products.map((product) => (
//                   <tr key={product._id} className="border-t border-gray-500/20">
//                     <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
//                       <div className="bg-gray-500/10 rounded p-2">
//                         <Image
//                           src={product.image[0]}
//                           alt="product Image"
//                           className="w-16"
//                           width={1280}
//                           height={720}
//                         />
//                       </div>
//                       <span className="truncate w-full">{product.name}</span>
//                     </td>
//                     <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
//                     <td className="px-4 py-3">${product.offerPrice}</td>
//                     <td className="px-4 py-3 max-sm:hidden flex gap-2">
//                       <button
//                         onClick={() => router.push(`/product/${product._id}`)}
//                         className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
//                       >
//                         <span className="hidden md:block">Visit</span>
//                         <Image
//                           className="h-3.5"
//                           src={assets.redirect_icon}
//                           alt="redirect_icon"
//                         />
//                       </button>

//                       {/* Delete button */}
//                       <button
//                         onClick={() =>
//                           setProducts((prev) =>
//                             prev.filter((p) => p._id !== product._id)
//                           )
//                         }
//                         className="flex items-center gap-1 px-2 py-2 bg-red-600 text-white rounded-md"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default ProductList;








"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "@/assets/assets";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/admin-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdminProduct();
    }
  }, [user]);

  // Delete product API call
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Toggle visibility API call
  const toggleVisibility = async (id, current) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `/api/product/${id}/visibility`,
        { visible: !current },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Visibility updated");
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, visible: !current } : p
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Visibility
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                    <td className="px-4 py-3">${product.offerPrice}</td>

                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        onClick={() => toggleVisibility(product._id, product.visible)}
                        className={`px-2 py-1 rounded-md text-white ${
                          product.visible ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {product.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    <td className="px-4 py-3 max-sm:hidden flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/admin/product/edit/${product._id}`)}
                        className="px-2 py-2 bg-blue-600 text-white rounded-md"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-2 py-2 bg-red-600 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
