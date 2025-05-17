// import React from "react";
// import ProductCard from "./ProductCard";
// import { useAppContext } from "@/context/AppContext";

// const HomeProducts = () => {

//   const { products, router } = useAppContext()

//   return (
//     <div className="flex flex-col items-center pt-14">
//       <div className="flex flex-col items-center">
//         <p className="text-3xl font-medium">
//           All <span className="text-orange-600">Products</span>
//         </p>
//         <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
//         {products.map((product, index) => <ProductCard key={index} product={product} />)}
//       </div>
//       <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
//         See more
//       </button>
//     </div>
//   );
// };

// export default HomeProducts;












//<----------------------------------------25 or More Products---------------------------------------------------->
// import React from "react";
// import ProductCard from "./ProductCard";
// import { useAppContext } from "@/context/AppContext";

// const HomeProducts = () => {
//   const { products, router } = useAppContext();

//   // Limit products to 25 for display
//   const visibleProducts = products.slice(0, 25);

//   return (
//     <div className="flex flex-col items-center pt-14">
//       <div className="flex flex-col items-center">
//         <p className="text-3xl font-medium">
//           All <span className="text-orange-600">Products</span>
//         </p>
//         <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
//         {visibleProducts.map((product, index) => (
//           <ProductCard key={index} product={product} />
//         ))}
//       </div>

//       {products.length > 25 && (
//         <button
//           onClick={() => { router.push('/all-products'); }}
//           className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
//         >
//           See more
//         </button>
//       )}
//     </div>
//   );
// };

// export default HomeProducts;











//<----------------------------------------Pagination---------------------------------------------------->
// import React, { useState } from "react";
// import ProductCard from "./ProductCard";
// import { useAppContext } from "@/context/AppContext";

// const PRODUCTS_PER_PAGE = 25;

// const HomeProducts = () => {
//   const { products, router } = useAppContext();
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

//   const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
//   const endIndex = startIndex + PRODUCTS_PER_PAGE;
//   const currentProducts = products.slice(startIndex, endIndex);

//   const handlePrev = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleNext = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   return (
//     <div className="flex flex-col items-center pt-14">
//       <div className="flex flex-col items-center">
//         <p className="text-3xl font-medium">
//           All <span className="text-orange-600">Products</span>
//         </p>
//         <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
//         {currentProducts.map((product, index) => (
//           <ProductCard key={index} product={product} />
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex items-center gap-4 mt-4">
//         <button
//           onClick={handlePrev}
//           disabled={currentPage === 1}
//           className="px-4 py-2 border rounded text-gray-600 hover:bg-slate-100 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="text-sm text-gray-500">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={handleNext}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 border rounded text-gray-600 hover:bg-slate-100 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {/* Optional: See more button for full listing */}
//       <button
//         onClick={() => router.push("/all-products")}
//         className="mt-6 px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
//       >
//         See all products
//       </button>
//     </div>
//   );
// };

// export default HomeProducts;















//<----------------------------------------Lazy Loading---------------------------------------------------->

//
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(25); // initial limit

  const visibleProducts = products.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 25);
  };

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">
          All <span className="text-orange-600">Products</span>
        </p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {visibleProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {visibleCount < products.length ? (
        <button
          onClick={handleLoadMore}
          className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
        >
          Load more
        </button>
      ) : (
        products.length > 25 && (
          <button
            onClick={() => router.push('/all-products')}
            className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
          >
            See all
          </button>
        )
      )}
    </div>
  );
};

export default HomeProducts;
