'use client';
import React, { useState, useEffect } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Simulate async data fetch (replace with real fetch)
    const fetchData = async () => {

      try {
        // Simulate delay
        await new Promise((resolve, reject) => {
          setTimeout(() => {

            // Toggle true/false to simulate error or success:
            
            const shouldFail = false; // change to true to test error
            if (shouldFail) reject(new Error("Failed to load data"));
            else resolve();
          }, 2000);
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
        <Loading />
        <p className="text-gray-700 text-lg font-medium">Please wait while loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-600 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  // Render homepage content if no error and loading done
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 mt-16">

        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
