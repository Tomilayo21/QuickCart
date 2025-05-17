'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const FeaturedProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    setProductData(product);
    if (product && product.image?.length > 0) {
      setMainImage(product.image[0]);
    }
  };

  useEffect(() => {
    if (id && products.length > 0) {
      fetchProductData();
    }
  }, [id, products.length]);

  return (
    <div className="flex flex-col items-center">
      {/* Product Details */}
      {productData && (
        <div className="w-full max-w-4xl p-4 mt-10">
          <h1 className="text-2xl font-semibold mb-4">{productData.name}</h1>
          {mainImage && (
            <img
              src={mainImage}
              alt="Main product image"
              className="w-full h-auto rounded"
            />
          )}
          <p className="mt-4 text-gray-600">{productData.description}</p>
          <p className="mt-2 text-lg font-semibold text-orange-600">
            ${productData.price}
          </p>
          <button
            onClick={() => addToCart(productData._id)}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
          >
            Add to Cart
          </button>
        </div>
      )}

      {/* Featured Products Section */}
      <div className="mt-14 w-full">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium">
            Featured <span className="text-orange-600">Products</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-12 px-4">
          {products
            .filter((product) => product._id !== id)
            .slice(0, 5)
            .map((product) => (
              <div
                key={product._id}
                className="relative group bg-[#E6E9F2] rounded-md p-2"
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-auto object-cover group-hover:brightness-75 transition duration-300 rounded"
                />
                <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-4 text-black space-y-2">
                  <p className="font-medium text-xl lg:text-2xl">{product.name}</p>
                  <p className="text-sm lg:text-base leading-5 max-w-60 line-clamp-2">
                    {product.description}
                  </p>
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded text-white"
                  >
                    Add to Cart
                    <img
                      alt="Redirect Icon"
                      width={12}
                      height={12}
                      className="h-3 w-3"
                    />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
