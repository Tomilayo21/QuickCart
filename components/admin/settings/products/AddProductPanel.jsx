'use client';

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import Footer from "@/components/admin/Footer";
import TiptapEditor from "@/components/TiptapEditor";
import AdminPage from "@/components/admin/AdminPage";



const AddProduct = () => {
  const { getToken, isAdmin, user } = useAppContext();
  const router = useRouter();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');


  useEffect(() => {
    if (!user || !isAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (uploadDone) {
      const timer = setTimeout(() => setUploadDone(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadDone]);

  if (!user || !isAdmin) {
    return <p>Redirecting...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    setUploadDone(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);
    formData.append('color', color);
    formData.append('brand', brand);
    formData.append('stock', stock);

    for (let i = 0; i < files.length; i++) {
      if (files[i]) formData.append('images', files[i]);
    }

    try {
      const token = await getToken();

      await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Product added successfully!");

      setFiles([]);
      setName('');
      setDescription('');
      setCategory('Earphone');
      setColor('');
      setBrand('');
      setPrice('');
      setOfferPrice('');
      setStock('');
      setUploadDone(true);

      // Redirect to Stripe checkout for payment (optional)
      const res = await axios.post('/api/stripe/checkout', {
        items: [
          {
            name: name,
            description: description,
            image: "", // optional: you can pass one of the uploaded image URLs here
            price: parseFloat(price),
            quantity: 1,
          }
        ]
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Add Products</h1>
        
        {/* Image Upload */}
        {/* <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label
              key={index}
              htmlFor={`image${index}`}
              className="relative w-24 h-24 border border-gray-300 rounded cursor-pointer flex items-center justify-center overflow-hidden"
            >
              <input
                onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }}
                type="file"
                id={`image${index}`}
                hidden
              />

              {files[index] ? (
                <Image
                  src={URL.createObjectURL(files[index])}
                  alt={`preview-${index}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <ImagePlus className="w-6 h-6 text-gray-500" />
              )}
            </label>
            ))}
          </div>
        </div> */}
        <div>
          <p className="text-base font-medium">Product Images</p>
          <div className="flex flex-wrap items-start gap-3 mt-2">
            {files.map((file, index) => (
              <div key={index} className="relative w-24 h-24 flex-shrink-0">
                <div className="w-24 h-24 border border-gray-300 rounded overflow-hidden relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />

                  {/* Make Primary */}
                  <button
                    onClick={() => {
                      const reordered = [file, ...files.filter((_, i) => i !== index)];
                      setFiles(reordered);
                    }}
                    className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center hover:bg-black"
                  >
                    {index === 0 ? "Primary" : "Make Primary"}
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => {
                      const updatedFiles = [...files];
                      updatedFiles.splice(index, 1);
                      setFiles(updatedFiles);
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-800"
                    title="Remove"
                  >
                    –
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Image */}
            {files.length < 10 && ( // limit max uploads if needed
              <label className="w-24 h-24 border border-gray-300 rounded cursor-pointer flex items-center justify-center overflow-hidden">
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFiles([...files, file]);
                    }
                  }}
                />
                <ImagePlus className="w-6 h-6 text-gray-500" />
              </label>
            )}
          </div>
        </div>


        {/* Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        {/* <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <TiptapEditor description={name} setDescription={setName} />
        </div> */}


        {/* Description */}
        {/* <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </div> */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <TiptapEditor description={description} setDescription={setDescription} />
        </div>

        {/* Options */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">Category</label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="color">Color</label>
            <select
              id="color"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setColor(e.target.value)}
              value={color}
            >
              <option value="">Select</option>
              <option value="Red">Red</option>
              <option value="Black">Black</option>
              <option value="Blue">Blue</option>
              <option value="White">White</option>
              <option value="Gray">Gray</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              <option value="Purple">Purple</option>
              <option value="Pink">Pink</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="brand">Brand</label>
            <select
              id="brand"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
              required
            >
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Sony">Sony</option>
              <option value="Huawei">Huawei</option>
              <option value="Bose">Bose</option>
              <option value="Infinix">Infinix</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Tecno">Tecno</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">Original Price</label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">Discount Price</label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading}
        >
          ADD
        </button>

        {uploading && <p className="mt-3 text-gray-700 font-medium">Please wait while upload is going on...</p>}
        {uploadDone && !uploading && (
          <p className="mt-3 text-green-600 font-semibold">Product uploaded successfully!</p>
        )}
      </form>
      <div className='mt-12'>
        <Footer />
      </div>
      <AdminPage/>
    </div>
  );
};

export default AddProduct;
