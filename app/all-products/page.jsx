"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Filter from "@/components/Filter";

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

  // Apply sorting based on "sort" param
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
    filtered.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return bDate - aDate; // Newest first
    });
  } else if (sort === "desc date") {
    filtered.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return aDate - bDate; // Oldest first
    });
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
