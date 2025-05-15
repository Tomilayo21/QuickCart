"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Filter from "@/components/Filter";
import { useAppContext } from "@/context/AppContext";



export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-lg">Loading products...</div>}>
      <AllProducts />
    </Suspense>
  );
}

const AllProducts = () => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();

  const minRaw = searchParams.get("min");
  const maxRaw = searchParams.get("max");
  const min = minRaw !== null && !isNaN(parseFloat(minRaw)) ? parseFloat(minRaw) : 0;
  const max = maxRaw !== null && !isNaN(parseFloat(maxRaw)) ? parseFloat(maxRaw) : Infinity;
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (type) filtered = filtered.filter((p) => p.type === type);
    if (category) filtered = filtered.filter((p) => p.category === category);

    filtered = filtered.filter((p) => {
      const offerPrice = typeof p.offerPrice === "string" ? parseFloat(p.offerPrice) : p.offerPrice;
      if (isNaN(offerPrice)) return false;
      return offerPrice >= min && offerPrice <= max;
    });

    if (sort === "asc price") {
      filtered.sort((a, b) => {
        const aPrice = typeof a.offerPrice === "string" ? parseFloat(a.offerPrice) : a.offerPrice;
        const bPrice = typeof b.offerPrice === "string" ? parseFloat(b.offerPrice) : b.offerPrice;
        return aPrice - bPrice;
      });
    } else if (sort === "desc price") {
      filtered.sort((a, b) => {
        const aPrice = typeof a.offerPrice === "string" ? parseFloat(a.offerPrice) : a.offerPrice;
        const bPrice = typeof b.offerPrice === "string" ? parseFloat(b.offerPrice) : b.offerPrice;
        return bPrice - aPrice;
      });
    } else if (sort === "asc date") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === "desc date") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, type, category, min, max, searchQuery, sort]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        <Filter searchQuery={searchQuery} />

        {filteredProducts.length === 0 ? (
          <div className="w-full text-center mt-16 text-lg text-gray-600">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};



























// 'use client';

// import { Suspense, useMemo } from "react";
// import { useSearchParams } from "next/navigation";

// import ProductCard from "@/components/ProductCard";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Filter from "@/components/Filter";
// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="p-10 text-center text-lg">Loading products...</div>}>
//       <AllProducts />
//     </Suspense>
//   );
// }

// const AllProducts = () => {
//   const { products, setProducts, getToken } = useAppContext();
//   const searchParams = useSearchParams();

//   const minRaw = searchParams.get("min");
//   const maxRaw = searchParams.get("max");
//   const min = minRaw !== null && !isNaN(parseFloat(minRaw)) ? parseFloat(minRaw) : 0;
//   const max = maxRaw !== null && !isNaN(parseFloat(maxRaw)) ? parseFloat(maxRaw) : Infinity;
//   const type = searchParams.get("type") || "";
//   const category = searchParams.get("category") || "";
//   const searchQuery = searchParams.get("search") || "";
//   const sort = searchParams.get("sort") || "";

//   const filteredProducts = useMemo(() => {
//     let filtered = [...products];

//     if (type) filtered = filtered.filter((p) => p.type === type);
//     if (category) filtered = filtered.filter((p) => p.category === category);

//     filtered = filtered.filter((p) => {
//       const offerPrice = typeof p.offerPrice === "string" ? parseFloat(p.offerPrice) : p.offerPrice;
//       if (isNaN(offerPrice)) return false;
//       return offerPrice >= min && offerPrice <= max;
//     });

//     if (sort === "asc price") {
//       filtered.sort((a, b) => {
//         const aPrice = typeof a.offerPrice === "string" ? parseFloat(a.offerPrice) : a.offerPrice;
//         const bPrice = typeof b.offerPrice === "string" ? parseFloat(b.offerPrice) : b.offerPrice;
//         return aPrice - bPrice;
//       });
//     } else if (sort === "desc price") {
//       filtered.sort((a, b) => {
//         const aPrice = typeof a.offerPrice === "string" ? parseFloat(a.offerPrice) : a.offerPrice;
//         const bPrice = typeof b.offerPrice === "string" ? parseFloat(b.offerPrice) : b.offerPrice;
//         return bPrice - aPrice;
//       });
//     } else if (sort === "asc date") {
//       filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     } else if (sort === "desc date") {
//       filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (p) =>
//           p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.description?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filtered;
//   }, [products, type, category, min, max, searchQuery, sort]);

//   // Delete handler
//   const handleDelete = async (productId) => {
//     try {
//       const token = await getToken();

//       // Call your delete API endpoint (adjust URL as needed)
//       const response = await axios.delete(`/api/product/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         // Remove product from local context state
//         setProducts(products.filter((p) => p._id !== productId));
//         toast.success("Product deleted successfully");
//       } else {
//         toast.error(response.data.message || "Failed to delete product");
//       }
//     } catch (error) {
//       toast.error(error.message || "Error deleting product");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
//         <div className="flex flex-col items-end pt-12">
//           <p className="text-2xl font-medium">All products</p>
//           <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
//         </div>

//         <Filter searchQuery={searchQuery} />

//         {filteredProducts.length === 0 ? (
//           <div className="w-full text-center mt-16 text-lg text-gray-600">
//             No products found matching your criteria.
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
//             {filteredProducts.map((product) => (
//               <div key={product._id} className="relative group">
//                 <ProductCard product={product} />
//                 {/* Delete button overlay on hover */}
//                 <button
//                   onClick={() => handleDelete(product._id)}
//                   className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
//                   aria-label={`Delete product ${product.name}`}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };
