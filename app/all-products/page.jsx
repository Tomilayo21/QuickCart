// "use client";

// import { Suspense, useMemo } from "react";
// import {
//   useSearchParams,
//   usePathname,
//   useRouter,
// } from "next/navigation";

// import ProductCard from "@/components/ProductCard";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Filter from "@/components/Filter";
// import { useAppContext } from "@/context/AppContext";

// const PRODUCTS_PER_PAGE = 10;

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="p-10 text-center text-lg">Loading products...</div>}>
//       <AllProducts />
//     </Suspense>
//   );
// }

// const AllProducts = () => {
//   const { products, loading } = useAppContext();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const router = useRouter();

//   // Get filter values
//   const minRaw = searchParams.get("min");
//   const maxRaw = searchParams.get("max");
//   const min = minRaw !== null && !isNaN(parseFloat(minRaw)) ? parseFloat(minRaw) : 0;
//   const max = maxRaw !== null && !isNaN(parseFloat(maxRaw)) ? parseFloat(maxRaw) : Infinity;
//   const type = searchParams.get("type") || "";
//   const category = searchParams.get("category") || "";
//   const searchQuery = searchParams.get("search") || "";
//   const sort = searchParams.get("sort") || "";
//   const pageRaw = searchParams.get("page");
//   const currentPage = pageRaw && !isNaN(parseInt(pageRaw)) && parseInt(pageRaw) > 0 ? parseInt(pageRaw) : 1;

//   // Loading state
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="w-full flex justify-center items-center h-96 text-lg text-gray-600">
//           Please wait...
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Filtering and sorting
//   const filteredProducts = useMemo(() => {
//     let filtered = [...products];

//     if (type) filtered = filtered.filter((p) => p.type === type);
//     if (category) filtered = filtered.filter((p) => p.category === category);

//     filtered = filtered.filter((p) => {
//       const offerPrice = typeof p.offerPrice === "string" ? parseFloat(p.offerPrice) : p.offerPrice;
//       return !isNaN(offerPrice) && offerPrice >= min && offerPrice <= max;
//     });

//     if (sort === "asc price") {
//       filtered.sort((a, b) => parseFloat(a.offerPrice) - parseFloat(b.offerPrice));
//     } else if (sort === "desc price") {
//       filtered.sort((a, b) => parseFloat(b.offerPrice) - parseFloat(a.offerPrice));
//     } else if (sort === "asc date") {
//       filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//     } else if (sort === "desc date") {
//       filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

//   // Pagination
//   const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * PRODUCTS_PER_PAGE,
//     currentPage * PRODUCTS_PER_PAGE
//   );

//   // Change page
//   const changePage = (newPage) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("page", newPage.toString());
//     router.push(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 pt-20">
//         <div className="flex flex-col items-end pt-12">
//           <p className="text-2xl font-medium">All products</p>
//           <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
//         </div>

//         {/* Filter UI */}
//         <Filter searchQuery={searchQuery} />

//         {/* Product List */}
//         {paginatedProducts.length === 0 ? (
//           <div className="w-full text-center mt-16 text-lg text-gray-600">
//             No products found matching your criteria.
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
//             {paginatedProducts.map((product, index) => (
//               <ProductCard key={index} product={product} />
//             ))}
//           </div>
//         )}

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-4 mt-8 mb-14 w-full">
//             <button
//               onClick={() => changePage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded bg-orange-600 text-white ${
//                 currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
//               }`}
//             >
//               Previous
//             </button>
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() => changePage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded bg-orange-600 text-white ${
//                 currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };













"use client";

import { Suspense, useMemo } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Filter from "@/components/Filter";
import { useAppContext } from "@/context/AppContext";

const PRODUCTS_PER_PAGE = 10;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-lg">Loading products...</div>}>
      <AllProducts />
    </Suspense>
  );
}

const AllProducts = () => {
  const { products, loading } = useAppContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get filter values
  const minRaw = searchParams.get("min");
  const maxRaw = searchParams.get("max");
  const min = minRaw !== null && !isNaN(parseFloat(minRaw)) ? parseFloat(minRaw) : 0;
  const max = maxRaw !== null && !isNaN(parseFloat(maxRaw)) ? parseFloat(maxRaw) : Infinity;
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const pageRaw = searchParams.get("page");
  const currentPage = pageRaw && !isNaN(parseInt(pageRaw)) && parseInt(pageRaw) > 0 ? parseInt(pageRaw) : 1;

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center items-center h-96 text-lg text-gray-600">
          Please wait...
        </div>
        <Footer />
      </>
    );
  }

  // Filtering and sorting
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (type) filtered = filtered.filter((p) => p.type === type);
    if (category) filtered = filtered.filter((p) => p.category === category);

    filtered = filtered.filter((p) => {
      const offerPrice = typeof p.offerPrice === "string" ? parseFloat(p.offerPrice) : p.offerPrice;
      return !isNaN(offerPrice) && offerPrice >= min && offerPrice <= max;
    });

    if (sort === "asc price") {
      filtered.sort((a, b) => parseFloat(a.offerPrice) - parseFloat(b.offerPrice));
    } else if (sort === "desc price") {
      filtered.sort((a, b) => parseFloat(b.offerPrice) - parseFloat(a.offerPrice));
    } else if (sort === "asc date") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === "desc date") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Change page
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 pt-20">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {/* Filter UI */}
        <Filter searchQuery={searchQuery} />

        {/* Product List */}
        {paginatedProducts.length === 0 ? (
          <div className="w-full text-center mt-16 text-lg text-gray-600">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
            {paginatedProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8 mb-14 w-full max-w-xl mx-auto px-4">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded bg-orange-600 text-white ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
              }`}
            >
              Previous
            </button>
            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded bg-orange-600 text-white ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
