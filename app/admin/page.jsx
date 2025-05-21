// 'use client';

// import React, { useState, useEffect } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";
// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// const AddProduct = () => {
//   const { getToken, isAdmin, user } = useAppContext();
//   const router = useRouter();

//   // Redirect non-admins or unauthenticated users immediately on mount
//   useEffect(() => {
//     if (!user || !isAdmin) {
//       router.replace("/"); // redirect to home or any page you want
//     }
//   }, [user, isAdmin, router]);

//   // Optionally, you can show a loading or empty state while redirecting
//   if (!user || !isAdmin) {
//     return <p>Redirecting...</p>;
//   }

//   const [files, setFiles] = useState([]);
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('Earphone');
//   const [price, setPrice] = useState('');
//   const [offerPrice, setOfferPrice] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [uploadDone, setUploadDone] = useState(false);
//   const [color, setColor] = useState('');
//   const [brand, setBrand] = useState('');

//   useEffect(() => {
//     if (uploadDone) {
//       const timer = setTimeout(() => setUploadDone(false), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [uploadDone]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setUploading(true);
//     setUploadDone(false);

//     const formData = new FormData();

//     formData.append('name', name);
//     formData.append('description', description);
//     formData.append('category', category);
//     formData.append('price', price);
//     formData.append('offerPrice', offerPrice);
//     formData.append('color', color);
//     formData.append('brand', brand);

//     for (let i = 0; i < files.length; i++) {
//       if (files[i]) formData.append('images', files[i]);
//     }

//     try {
//       const token = await getToken();

//       await axios.post('/api/product/add', formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success("Product added successfully!");
//       setFiles([]);
//       setName('');
//       setDescription('');
//       setCategory('Earphone');
//       setColor('');
//       setBrand('');
//       setPrice('');
//       setOfferPrice('');
//       setUploadDone(true);
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message || "Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex-1 min-h-screen flex flex-col justify-between">
//       <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
//         {/* Product Images */}
//         <div>
//           <p className="text-base font-medium">Product Image</p>
//           <div className="flex flex-wrap items-center gap-3 mt-2">
//             {[...Array(4)].map((_, index) => (
//               <label key={index} htmlFor={`image${index}`}>
//                 <input
//                   onChange={(e) => {
//                     const updatedFiles = [...files];
//                     updatedFiles[index] = e.target.files[0];
//                     setFiles(updatedFiles);
//                   }}
//                   type="file"
//                   id={`image${index}`}
//                   hidden
//                 />
//                 <Image
//                   key={index}
//                   className="max-w-24 cursor-pointer"
//                   src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
//                   alt=""
//                   width={100}
//                   height={100}
//                 />
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Product Name */}
//         <div className="flex flex-col gap-1 max-w-md">
//           <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
//           <input
//             id="product-name"
//             type="text"
//             placeholder="Type here"
//             className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             required
//           />
//         </div>

//         {/* Product Description */}
//         <div className="flex flex-col gap-1 max-w-md">
//           <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
//           <textarea
//             id="product-description"
//             rows={4}
//             className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
//             placeholder="Type here"
//             onChange={(e) => setDescription(e.target.value)}
//             value={description}
//             required
//           />
//         </div>

//         {/* Category, Price, Offer Price */}
//         <div className="flex items-center gap-5 flex-wrap">
//           <div className="flex flex-col gap-1 w-32">
//             <label className="text-base font-medium" htmlFor="category">Category</label>
//             <select
//               id="category"
//               className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
//               onChange={(e) => setCategory(e.target.value)}
//               value={category}
//             >
//               <option value="Earphone">Earphone</option>
//               <option value="Headphone">Headphone</option>
//               <option value="Watch">Watch</option>
//               <option value="Smartphone">Smartphone</option>
//               <option value="Laptop">Laptop</option>
//               <option value="Camera">Camera</option>
//               <option value="Accessories">Accessories</option>
//             </select>
//           </div>

//           <div className="flex flex-col gap-1 w-32">
//             <label className="text-base font-medium" htmlFor="color">Color</label>
//             <input
//               id="color"
//               type="text"
//               placeholder="Color"
//               className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
//               onChange={(e) => setColor(e.target.value)}
//               value={color}
//               required
//             />
//           </div>

//           <div className="flex flex-col gap-1 w-32">
//             <label className="text-base font-medium" htmlFor="brand">Brand</label>
//             <input
//               id="brand"
//               type="text"
//               placeholder="Brand"
//               className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
//               onChange={(e) => setBrand(e.target.value)}
//               value={brand}
//               required
//             />
//           </div>


//           <div className="flex flex-col gap-1 w-32">
//             <label className="text-base font-medium" htmlFor="product-price">Original Price</label>
//             <input
//               id="product-price"
//               type="number"
//               placeholder="0"
//               className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
//               onChange={(e) => setPrice(e.target.value)}
//               value={price}
//               required
//             />
//           </div>

//           <div className="flex flex-col gap-1 w-32">
//             <label className="text-base font-medium" htmlFor="offer-price">Discount Price</label>
//             <input
//               id="offer-price"
//               type="number"
//               placeholder="0"
//               className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
//               onChange={(e) => setOfferPrice(e.target.value)}
//               value={offerPrice}
//               required
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={uploading}
//         >
//           ADD
//         </button>

//         {/* Upload status messages */}
//         {uploading && (
//           <p className="mt-3 text-gray-700 font-medium">Please wait while upload is going on...</p>
//         )}
//         {uploadDone && !uploading && (
//           <p className="mt-3 text-green-600 font-semibold">Product uploaded successfully! </p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default AddProduct;







'use client';

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const { getToken, isAdmin, user } = useAppContext();
  const router = useRouter();

  // ✅ All hooks called before any conditional return
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

  useEffect(() => {
    if (!user || !isAdmin) {
      router.replace("/"); // redirect to home or any page you want
    }
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (uploadDone) {
      const timer = setTimeout(() => setUploadDone(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadDone]);

  // ✅ Conditional rendering AFTER hook declarations
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
      setUploadDone(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        {/* Product Images */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
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
                <Image
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
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

        {/* Product Description */}
        <div className="flex flex-col gap-1 max-w-md">
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
        </div>

        {/* Category, Color, Brand, Price, Offer Price */}
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
            <input
              id="color"
              type="text"
              placeholder="Color"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setColor(e.target.value)}
              value={color}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="brand">Brand</label>
            <input
              id="brand"
              type="text"
              placeholder="Brand"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
              required
            />
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading}
        >
          ADD
        </button>

        {/* Upload status messages */}
        {uploading && (
          <p className="mt-3 text-gray-700 font-medium">Please wait while upload is going on...</p>
        )}
        {uploadDone && !uploading && (
          <p className="mt-3 text-green-600 font-semibold">Product uploaded successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
