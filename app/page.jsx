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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sync theme
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Elfsight Script Injection
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    // Simulated fetch
    const fetchData = async () => {
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
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

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
        <Loading />
        {/* <p className="text-gray-700 text-lg font-medium">Please wait while loading...</p> */}
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

  return (
    <div className="min-h-[200vh] bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32 mt-16">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>

      <Footer />
      {/* <ScrollButton /> */}

      {/* Elfsight Chatbot Embed with Reduced Size */}
      <div
        style={{
          transform: "scale(0.8)",
          transformOrigin: "bottom right",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <div
          className="elfsight-app-8c11fe9a-bb8d-49e6-a42c-a065429443e6"
          data-elfsight-app-lazy
        ></div>
      </div>
    </div>
  );
};

export default Home;


