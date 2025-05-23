// // 'use client';

// // import React from 'react';
// // import { assets } from '@/assets/assets';
// // import Image from 'next/image';
// // import { useAppContext } from '@/context/AppContext';

// // const ProductCard = ({ product }) => {
// //   const { currency, router, addToCart } = useAppContext();

// //   const handleCardClick = () => {
// //     router.push('/product/' + product._id);
// //     scrollTo(0, 0);
// //   };

// //   const handleAddToCart = (e) => {
// //     e.stopPropagation(); // Prevent card click
// //     addToCart(product);
// //   };

// //   return (
// //     <div
// //       onClick={handleCardClick}
// //       className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
// //     >
// //       <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
// //         <Image
// //           src={product.image[0]}
// //           alt={product.name}
// //           className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
// //           width={800}
// //           height={800}
// //         />
// //         <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
// //           <Image
// //             className="h-3 w-3"
// //             src={assets.heart_icon}
// //             alt="heart_icon"
// //           />
// //         </button>
// //       </div>

// //       <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
// //       <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
// //         {product.description}
// //       </p>

// //       <div className="flex items-center gap-2">
// //         <p className="text-xs">4.5</p>
// //         <div className="flex items-center gap-0.5">
// //           {Array.from({ length: 5 }).map((_, index) => (
// //             <Image
// //               key={index}
// //               className="h-3 w-3"
// //               src={
// //                 index < Math.floor(4)
// //                   ? assets.star_icon
// //                   : assets.star_dull_icon
// //               }
// //               alt="star_icon"
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       <div className="flex items-end justify-between w-full mt-1">
// //         <p className="text-base font-medium">
// //           {currency}
// //           {product.offerPrice}
// //         </p>
// //         <button
// //           onClick={handleAddToCart}
// //           className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
// //         >
// //           Add to Cart
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductCard;









// 'use client';

// import React from 'react';
// import { assets } from '@/assets/assets';
// import Image from 'next/image';
// import { useAppContext } from '@/context/AppContext';
// import { useClerk } from '@clerk/nextjs';

// const ProductCard = ({ product }) => {
//   const { currency, router, addToCart, user } = useAppContext();
//   const { openSignIn } = useClerk();

//   const handleCardClick = () => {
//     router.push('/product/' + product._id);
//     scrollTo(0, 0);
//   };

//   const handleAddToCart = (e) => {
//     e.stopPropagation(); // Prevent card click
//     if (!user) {
//       alert('Please log in to add items to cart.');
//       openSignIn();
//       return;
//     }
//     addToCart(product);
//   };

//   return (
//     <div
//       onClick={handleCardClick}
//       className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
//     >
//       <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
//         <Image
//           src={product.image[0]}
//           alt={product.name}
//           className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
//           width={800}
//           height={800}
//         />
//         <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
//           <Image
//             className="h-3 w-3"
//             src={assets.heart_icon}
//             alt="heart_icon"
//           />
//         </button>
//       </div>

//       <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
//       <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
//         {product.description}
//       </p>

//       <div className="flex items-center gap-2">
//         <p className="text-xs">4.5</p>
//         <div className="flex items-center gap-0.5">
//           {Array.from({ length: 5 }).map((_, index) => (
//             <Image
//               key={index}
//               className="h-3 w-3"
//               src={
//                 index < Math.floor(4)
//                   ? assets.star_icon
//                   : assets.star_dull_icon
//               }
//               alt="star_icon"
//             />
//           ))}
//         </div>
//       </div>

//       <div className="flex items-end justify-between w-full mt-1">
//         <p className="text-base font-medium">
//           {currency}
//           {product.offerPrice}
//         </p>
//         <button
//           onClick={handleAddToCart}
//           className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;















// 'use client';

// import React from 'react';
// import { assets } from '@/assets/assets';
// import Image from 'next/image';
// import { useAppContext } from '@/context/AppContext';
// import { useClerk } from '@clerk/nextjs';
// import useSWR from 'swr';

// const fetcher = (url) => fetch(url).then(res => res.json());

// const ProductCard = ({ product }) => {
//   const { currency, router, addToCart, user } = useAppContext();
//   const { openSignIn } = useClerk();
//   const { data: reviews } = useSWR(`/api/reviews/${product._id}`, fetcher);
//   const avgRating = reviews?.reduce((a, b) => a + b.rating, 0) / reviews?.length || 0;

//   const handleCardClick = () => {
//     router.push('/product/' + product._id);
//     scrollTo(0, 0);
//   };

//   const handleAddToCart = (e) => {
//     e.stopPropagation(); // Prevent card click
//     if (!user) {
//       alert('Please log in to add items to cart.');
//       openSignIn();
//       return;
//     }
//     addToCart(product);
//   };

//   return (
//     <div
//       onClick={handleCardClick}
//       className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
//     >
//       <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
//         <Image
//           src={product.image[0]}
//           alt={product.name}
//           className="group-hover:scale-105 transition object-cover w-full h-full"
//           width={800}
//           height={800}
//         />
//         <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
//           <Image
//             className="h-3 w-3"
//             src={assets.heart_icon}
//             alt="heart_icon"
//           />
//         </button>
//       </div>

//       <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
//       <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
//         {product.description}
//       </p>

//       <div className="flex items-center gap-2">
//         <p className="text-xs">4.5</p>
//         <div className="flex items-center gap-0.5">
//           {/* {Array.from({ length: 5 }).map((_, index) => (
//             <Image
//               key={index}
//               className="h-3 w-3"
//               src={
//                 index < Math.floor(4)
//                   ? assets.star_icon
//                   : assets.star_dull_icon
//               }
//               alt="star_icon"
//             />
//           ))} */}
//           <p>Average Rating: {avgRating.toFixed(1)} ⭐</p>
//           <p>{reviews?.length || 0} Reviews</p>
//         </div>
//       </div>

//       <div className="flex items-end justify-between w-full mt-1">
//         <p className="text-base font-medium">
//           {currency}
//           {product.offerPrice}
//         </p>
//         <button
//           onClick={handleAddToCart}
//           className="px-3 py-1 text-[10px] sm:text-xs text-gray-500 border border-gray-500/20 rounded-full hover:bg-slate-50 transition w-fit"
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


























































//.....................................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { assets } from '@/assets/assets';
// import { useAppContext } from '@/context/AppContext';
// import { useClerk } from '@clerk/nextjs';
// import useSWR from 'swr';

// const fetcher = (url) => fetch(url).then((res) => res.json());

// const ProductCard = ({ product }) => {
//   const { currency, router, addToCart, user } = useAppContext();
//   const { openSignIn } = useClerk();

//   // Fetch only approved reviews for product (public)
//   const { data: reviews = [] } = useSWR(`/api/reviews?productId=${product._id}`, fetcher);

//   // Calculate average rating
//   const avgRating =
//     reviews.length > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;

//   const handleCardClick = () => {
//     router.push('/product/' + product._id);
//     scrollTo(0, 0);
//   };

//   const handleAddToCart = (e) => {
//     e.stopPropagation();
//     if (!user) {
//       alert('Please log in to add items to cart.');
//       openSignIn();
//       return;
//     }
//     addToCart(product);
//   };

//   return (
//     <div
//       onClick={handleCardClick}
//       className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
//     >
//       <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
//         <Image
//           src={product.image[0]}
//           alt={product.name}
//           className="group-hover:scale-105 transition object-cover w-full h-full"
//           width={800}
//           height={800}
//         />
//         <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
//           <Image className="h-3 w-3" src={assets.heart_icon} alt="heart_icon" />
//         </button>
//       </div>

//       <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
//       <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>

//       <div className="flex items-center gap-2">
//         <p className="text-xs">{avgRating.toFixed(1)}</p>
//         <div className="flex items-center gap-0.5">
//           <p>Average Rating: {avgRating.toFixed(1)} ⭐</p>
//           <p>{reviews.length} Reviews</p>
//         </div>
//       </div>

//       <div className="flex items-end justify-between w-full mt-1">
//         <p className="text-base font-medium">
//           {currency}
//           {product.offerPrice}
//         </p>
//         <button
//           onClick={handleAddToCart}
//           className="px-3 py-1 text-[10px] sm:text-xs text-gray-500 border border-gray-500/20 rounded-full hover:bg-slate-50 transition w-fit"
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;











'use client';

import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { useClerk } from '@clerk/nextjs';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductCard = ({ product }) => {
  const { currency, router, addToCart, user } = useAppContext();
  const { openSignIn } = useClerk();

  // Fetch only approved reviews for product (public)
  const { data: reviews = [] } = useSWR(
    `/api/reviews?productId=${product._id}`,
    fetcher
  );

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleCardClick = () => {
    router.push('/product/' + product._id);
    scrollTo(0, 0);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add items to cart.');
      openSignIn();
      return;
    }
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div className="relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden group">
        <Image
          src={product.image[0]}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          <Image src={assets.heart_icon} alt="heart_icon" width={12} height={12} />
        </button>
      </div>

      <p className="text-base font-medium pt-2 w-full truncate">{product.name}</p>
      <p className="text-xs text-gray-500/70 w-full truncate max-sm:hidden">
        {product.description}
      </p>

      {/* Ratings on separate lines */}
      <div className="mt-2 text-sm text-gray-700">
        <p>Average Rating: {avgRating.toFixed(1)} ⭐</p>
        <p>{reviews.length} Reviews</p>
      </div>

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency}
          {product.offerPrice}
        </p>
        <button
          onClick={handleAddToCart}
          className="px-3 py-1 text-xs text-gray-500 border border-gray-300 rounded-full hover:bg-slate-50 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
