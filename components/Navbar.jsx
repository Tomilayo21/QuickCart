// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
// import Link from "next/link";
// import { useAppContext } from "@/context/AppContext";
// import Image from "next/image";
// import { useClerk, UserButton } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

// const Navbar = () => {
//   const { isSeller, user, getCartCount } = useAppContext();
//   const { openSignIn } = useClerk();
//   const router = useRouter();

//   const [searchExpanded, setSearchExpanded] = useState(false);
//   const searchRef = useRef(null);
//   const searchButtonRef = useRef(null);
//   const [inputValue, setInputValue] = useState("");

//   const cartCount = getCartCount();

//   useEffect(() => {
//     if (searchExpanded && searchRef.current) {
//       searchRef.current.focus();
//     }
//   }, [searchExpanded]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(e.target) &&
//         !searchButtonRef.current.contains(e.target)
//       ) {
//         setSearchExpanded(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       if (inputValue.trim()) {
//         router.push(`/all-products?search=${encodeURIComponent(inputValue.trim())}`);
//         setSearchExpanded(false);
//       }
//     }
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-white flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 shadow-sm">
//       {/* Logo */}
//       <Image
//         className="cursor-pointer w-28 md:w-32"
//         onClick={() => router.push("/")}
//         src={assets.logo}
//         alt="logo"
//         width={100}
//         height={100}
//       />

//       {/* Navigation links - desktop only */}
//       <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
//         <Link href="/" className="hover:text-gray-900 transition">Home</Link>
//         <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
//         <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
//         <Link href="/" className="hover:text-gray-900 transition">Contact</Link>
//         {isSeller && (
//           <button
//             onClick={() => router.push("/seller")}
//             className="text-xs border px-4 py-1.5 rounded-full"
//           >
//             Seller Dashboard
//           </button>
//         )}
//       </div>

//       {/* Icons: Search, Cart, User */}
//       <ul className="flex items-center gap-3 relative">
//         {/* Search input + button */}
//         <div className="relative flex items-center">
//           <input
//             ref={searchRef}
//             type="text"
//             placeholder="Search..."
//             onFocus={() => setSearchExpanded(true)}
//             onKeyDown={handleKeyDown}
//             onChange={(e) => setInputValue(e.target.value)}
//             className={`absolute md:static transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 ${
//               searchExpanded ? "opacity-100 w-48 md:ml-0 right-8" : "opacity-0 w-0 px-0"
//             }`}
//             style={{ left: "-12rem" }}
//           />
//           <button
//             ref={searchButtonRef}
//             onClick={() => setSearchExpanded((prev) => !prev)}
//             className="z-10"
//             aria-label="Search"
//           >
//             <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
//           </button>
//         </div>

//         {/* Cart icon - hidden on mobile */}
//         <button
//           aria-label="Cart"
//           onClick={() => router.push("/cart")}
//           className="relative hidden md:block"
//         >
//           <CartIcon className="w-6 h-6 text-gray-700 transition" />
//           {cartCount > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 font-bold select-none" style={{ minWidth: "18px", height: "18px", lineHeight: "18px" }}>
//               {cartCount}
//             </span>
//           )}
//         </button>

//         {/* Account icon */}
//         {user ? (
//           <UserButton
//             appearance={{
//               elements: {
//                 avatarBox: "w-5 h-5",
//               },
//             }}
//           >
//             <UserButton.MenuItems>
//               {/* <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} /> */}
//               <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
//             </UserButton.MenuItems>
//           </UserButton>
//         ) : (
//           <button
//             onClick={openSignIn}
//             className="flex items-center gap-2 transition"
//           >
//             <Image src={assets.user_icon} alt="user icon" />
//           </button>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;



















"use client";

import React, { useState, useRef, useEffect } from "react";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Hook to detect mobile view
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const Navbar = () => {
  const { isSeller, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const cartCount = getCartCount();

  useEffect(() => {
    if (searchExpanded && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchExpanded]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !searchButtonRef.current.contains(e.target)
      ) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(inputValue.trim())}`);
      setSearchExpanded(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 shadow-sm">
      {/* Logo */}
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
        width={100}
        height={100}
      />

      {/* Navigation links - desktop only */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Icons: Search, Cart, User */}
      <ul className="flex items-center gap-3 relative">
        {/* Search input + button */}
        <div className="relative flex items-center">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchExpanded(true)}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
            className={`absolute md:static transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 ${
              searchExpanded ? "opacity-100 w-48 md:ml-0 right-8" : "opacity-0 w-0 px-0"
            }`}
            style={{ left: "-12rem" }}
          />
          <button
            ref={searchButtonRef}
            onClick={() => setSearchExpanded((prev) => !prev)}
            className="z-10"
            aria-label="Search"
          >
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </div>

        {/* Cart icon - hidden on mobile */}
        <button
          aria-label="Cart"
          onClick={() => router.push("/cart")}
          className="relative hidden md:block"
        >
          <CartIcon className="w-6 h-6 text-gray-700 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 font-bold select-none" style={{ minWidth: "18px", height: "18px", lineHeight: "18px" }}>
              {cartCount}
            </span>
          )}
        </button>

        {/* Account icon */}
        {user ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-5 h-5",
              },
            }}
          >
            <UserButton.MenuItems>
              {/* Cart link inside account - only on mobile */}
              {isMobile && (
                
                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon />}
                  onClick={() => router.push("/cart")}
                />
              )}
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
            
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
