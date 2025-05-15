"use client";
import React, { useState, useRef, useEffect } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { isSeller, user } = useAppContext();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef(null);
  const searchButtonRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

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
    if (e.key === "Enter") {
      if (inputValue.trim()) {
        router.push(`/all-products?search=${encodeURIComponent(inputValue.trim())}`);
        setSearchExpanded(false);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 shadow-sm">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

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

      <ul className="hidden md:flex items-center gap-4 relative">
        <div className="relative flex items-center transition-all duration-300">
          <button
            ref={searchButtonRef}
            onClick={() => setSearchExpanded((prev) => !prev)}
            className="z-10"
            aria-label="Search"
          >
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchExpanded(true)}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
            className={`transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 ml-2 ${
              searchExpanded ? "w-48 opacity-100" : "w-0 opacity-0 px-0"
            }`}
          />
        </div>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
          </button>
        )}
      </ul>

      {/* Mobile version */}
      <div className="flex items-center md:hidden gap-3">
        <button onClick={() => setSearchExpanded(!searchExpanded)} aria-label="Toggle Search">
          <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        </button>

        {searchExpanded && (
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputValue(e.target.value)}
            className="transition-all duration-300 ease-in-out transform bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 mt-2 w-48 opacity-100"
          />
        )}

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push("/")} />
              <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push("/all-products")} />
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
