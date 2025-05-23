'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import { useAppContext } from '@/context/AppContext';
import { useUser } from '@clerk/nextjs';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart } = useAppContext();
  const { user } = useUser();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    setProductData(products.find(p => p._id === id) || null);
  }, [id, products]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/reviews?productId=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) return router.push('/login');
    addToCart(productData);
  };

  const handleSubmitReview = async () => {
    if (!user) return alert('Please log in to submit a review.');
    await fetch('/api/reviews', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ productId: id, rating, comment, userName: user.fullName || 'Anonymous' })
    });
    setRating(5);
    setComment('');
    setPage(1);
    const refreshed = await fetch(`/api/reviews?productId=${id}`).then(r => r.json());
    setReviews(refreshed);
  };

  if (!productData) return <Loading />;

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const start = (page - 1) * reviewsPerPage;
  const current = reviews.slice(start, start + reviewsPerPage);

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) =>
          i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 mt-24 space-y-10">
        {/* Product Info */}
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <div className="rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={mainImage || productData.image[0]}
                alt={productData.name}
                width={1280} height={720}
                className="w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productData.image.map((img,i) => (
                <div key={i} className="cursor-pointer" onClick={()=>setMainImage(img)}>
                  <Image src={img} alt="" width={200} height={200} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{productData.name}</h1>
            <p className="mt-2 text-gray-700">{productData.description}</p>
            <div className="mt-4">
              <span className="text-2xl font-semibold">₦{productData.offerPrice}</span>
              <span className="line-through text-gray-500 ml-2">₦{productData.price}</span>
            </div>
            <div className="mt-6 flex gap-4">
              <button onClick={handleAddToCart} className="px-6 py-2 bg-indigo-600 text-white rounded">
                Add to Cart
              </button>
              <button onClick={()=>router.push('/cart')} className="px-6 py-2 border border-indigo-600 rounded">
                Go to Cart
              </button>
            </div>

            {/* Submit Review */}
            <div className="mt-8">
              {user ? (
                <>
                  <h2 className="font-semibold mb-2">Leave a Review</h2>
                  <label className="flex items-center gap-2 mb-2">
                    Rating:
                    <select
                      value={rating}
                      onChange={e => setRating(+e.target.value)}
                      className="border rounded p-1"
                    >
                      {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full border rounded p-2 mb-2"
                    placeholder="Your comment..."
                  />
                  <button
                    onClick={handleSubmitReview}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                  >
                    Submit Review
                  </button>
                </>
              ) : (
                <p className="text-red-600">Please sign in to leave a review.</p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews List with Pagination */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          {current.length === 0 ? (
            <p>No reviews yet.</p>
          ) : current.map(r => (
            <div key={r._id} className="border-b pb-2">
              <p className="font-semibold">{r.userName}</p>
              {renderStars(r.rating)}
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === productData.category && p._id !== id)
              .slice(0,4)
              .map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
