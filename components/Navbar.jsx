"use client";

import React, { useState, useRef, useEffect } from "react";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAdmin, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(inputValue.trim())}`);
      setSearchExpanded(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300 shadow-sm text-gray-700">
      {/* Main flex container for all items on one line */}
      <div className="flex items-center justify-between px-4 py-3 md:px-16 lg:px-32 w-full">
        {/* Left: Logo */}
        <Image
          className="cursor-pointer w-24 md:w-32"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="logo"
          width={100}
          height={100}
        />

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-8 flex-1 px-8">
          <Link
            href="/"
            className="hover:text-gray-900 transition bg-transparent hover:bg-[#EBEDED] rounded p-2"
          >
            Home
          </Link>
          <Link
            href="/all-products"
            className="hover:text-gray-900 transition bg-transparent hover:bg-[#EBEDED] rounded p-2"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-900 transition bg-transparent hover:bg-[#EBEDED] rounded p-2"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-900 transition bg-transparent hover:bg-[#EBEDED] rounded p-2"
          >
            Contact
          </Link>
          <Link
            href="/my-orders"
            className="hover:text-gray-900 transition bg-transparent hover:bg-[#EBEDED] rounded p-2"
          >
            My Orders
          </Link>
        </div>

        {/* Right: Desktop Only - Admin + Search + Cart + Account */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="text-xs border px-4 py-1.5 rounded-full"
            >
              Admin Dashboard
            </button>
          )}

          {/* Search */}
          <div className="relative flex items-center">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchExpanded(true)}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
              className={`transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 ${
                searchExpanded ? "opacity-100 w-48" : "opacity-0 w-0 px-0"
              }`}
            />
            <button
              ref={searchButtonRef}
              onClick={() => {
                if (inputValue.trim()) {
                  router.push(`/all-products?search=${encodeURIComponent(inputValue.trim())}`);
                  setSearchExpanded(false);
                } else {
                  setSearchExpanded((prev) => !prev);
                }
              }}
              className="ml-1"
              aria-label="Search"
            >
              <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
            </button>
          </div>

          {/* Cart */}
          {user && (
            <button aria-label="Cart" onClick={() => router.push("/cart")} className="relative">
              <CartIcon className="w-4 h-4 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full px-1 font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Account */}
          {user ? (
            <UserButton appearance={{ elements: { avatarBox: "w-5 h-5" } }} />
          ) : (
            <button onClick={openSignIn} className="flex items-center gap-2 transition">
              <Image className="w-4 h-4" src={assets.user_icon} alt="user icon" />
            </button>
          )}
        </div>

        {/* Mobile Only - Search, Admin, Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile search, admin, menu */}
          <div className="relative flex items-center">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchExpanded(true)}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
              className={`transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 ${
                searchExpanded ? "opacity-100 w-40" : "opacity-0 w-0 px-0"
              }`}
            />
            <button
              ref={searchButtonRef}
              onClick={() => {
                if (inputValue.trim()) {
                  router.push(`/all-products?search=${encodeURIComponent(inputValue.trim())}`);
                  setSearchExpanded(false);
                } else {
                  setSearchExpanded((prev) => !prev);
                }
              }}
              className="ml-1"
              aria-label="Search"
            >
              <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
            </button>
          </div>

          {isAdmin && (
            <button onClick={() => router.push("/admin")} className="text-xs border px-2 py-1 rounded-full">
              Admin
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && isMobile && (
        <div className="flex flex-col gap-4 px-6 pb-4 md:hidden">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:bg-[#EBEDED] rounded px-2 py-1">
            Home
          </Link>
          <Link href="/all-products" onClick={() => setMobileMenuOpen(false)} className="hover:bg-[#EBEDED] rounded px-2 py-1">
            Products
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:bg-[#EBEDED] rounded px-2 py-1">
            About Us
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:bg-[#EBEDED] rounded px-2 py-1">
            Contact
          </Link>
          <Link href="/my-orders" onClick={() => setMobileMenuOpen(false)} className="hover:bg-[#EBEDED] rounded px-2 py-1">
            My Orders
          </Link>

          {user && (
            <button
              onClick={() => {
                router.push("/cart");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 hover:bg-[#EBEDED] rounded px-2 py-1"
            >
              <CartIcon className="w-4 h-4 text-gray-700" />
              Cart ({cartCount})
            </button>
          )}

          {user ? (
            <UserButton appearance={{ elements: { avatarBox: "w-5 h-5" } }} afterSignOutUrl="/" About/> 
          ) : (
            <button
              onClick={() => {
                openSignIn();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 hover:bg-[#EBEDED] rounded px-2 py-1"
            > 
              <Image className="w-4 h-4" src={assets.user_icon} alt="user icon" />
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
