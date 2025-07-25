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
import { ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMemo } from 'react';


export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, currency } = useAppContext();
  const { user } = useUser();
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeUsers, setLikeUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const reviewsPerPage = 5;


  useEffect(() => {
  if (!id || !products.length) return;
  const product = products.find(p => p._id === id);
  if (product) {
    setProductData(product);
    setLikeCount(product.likes?.length || 0);
    if (user) {
      setLiked(product.likes?.includes(user.id));
    }
  }
}, [id, products, user]);


useEffect(() => {
  if (productData?.likes?.length > 0) {
    fetch('/api/likes/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: productData.likes }),
    })
    .then(res => res.json())
    .then(data => setLikeUsers(data.users || []));
  }
}, [productData]);

const toggleLike = async () => {
  if (!user) return router.push('/login');

  try {
    const res = await fetch('/api/likes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, userId: user.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Failed to update like');
      return;
    }

    setLiked(data.liked);
    setLikeCount((prev) => data.liked ? prev + 1 : prev - 1);

    // Optimistically update likeUsers state
    setLikeUsers((prevUsers) => {
      if (data.liked) {
        // Add user to the list if not already present
        const alreadyLiked = prevUsers.some((u) => u.id === user.id);
        if (!alreadyLiked) {
          return [{ id: user.id, fullName: user.username || 'Anonymous' }, ...prevUsers];
        }
        return prevUsers;
      } else {
        // Remove user from the list
        return prevUsers.filter((u) => u.id !== user.id);
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    alert('Something went wrong while updating the like.');
  }
};

useEffect(() => {
  if (productData?.likes?.length > 0) {
    fetch('/api/likes/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: productData.likes }),
    })
    .then(res => res.json())
    .then(data => setLikeUsers(data.users || []));
  }
}, [productData]);

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
  const alreadyReviewed = reviews.some(
    (r) => r.userId === user?.id // or user?.email depending on what you store
  );

  if (alreadyReviewed) {
    toast.error("You have already reviewed this product.");
    return;
  }
  
  try {
    setLoading(true); // start loading before the request

    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: id,
        rating,
        comment,
        userId: user.id, // include this if you're storing userId
        // userName: user.fullName || 'Anonymous',
        username: user.username || 'unknown'
      }),
    });

    toast.success("Review submitted successfully!");
    setRating(5);
    setComment('');
    setPage(1);

    const refreshed = await fetch(`/api/reviews?productId=${id}`).then(r => r.json());
    setReviews(refreshed);
  } catch (err) {
    toast.error("Something went wrong.");
  } finally {
    setLoading(false); 
  }
};

const handleHelpfulClick = async (reviewId) => {
    try {
      const res = await fetch('/api/reviews/helpful', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      });

      if (!res.ok) throw new Error('Failed to mark helpful');

      const data = await res.json();

      // update helpful count in local state
      setReviews(prev =>
        prev.map(r =>
          r._id === reviewId ? { ...r, helpful: data.helpful } : r
        )
      );
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  if (!productData) return <Loading />;

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const start = (page - 1) * reviewsPerPage;
  // const current = reviews.slice(start, start + reviewsPerPage);
  const currentReviews = reviews.slice(start, start + reviewsPerPage);
  const relatedProducts = products.filter(p => p.category === productData.category && p._id !== id).slice(0, 4);
  const visibleRelatedProducts = relatedProducts.filter(p => p.visible !== false);
  // const visibleRelatedProducts = useMemo(() => {
  //   if (!productData) return [];
  //   return products
  //     .filter(p => p.category === productData.category && p._id !== id && p.visible !== false)
  //     .slice(0, 4);
  // }, [products, productData, id]);


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
    <div className=" flex flex-col items-center mt-8 mb-8 bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <div className="px-6 md:px-16 lg:px-32 mt-16 space-y-10">
        {/* Product Info */}
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
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
            {/* <div
              className="text-3xl font-bold text-black dark:text-white"
              dangerouslySetInnerHTML={{ __html: productData.name }}
            /> */}
            <h1 className="text-3xl font-bold text-black dark:text-white">{productData.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              {renderStars(
                Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0)
              )}
              <span className="text-sm text-gray-500 ml-2">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div
              className="mt-2 text-black dark:text-white"
              dangerouslySetInnerHTML={{ __html: productData.description }}
            />

            <div className="mt-4">
              <span className="text-2xl font-semibold text-black dark:text-white">{currency}{productData.offerPrice}</span>
              <span className="line-through text-gray-500 dark:text-gray-400 ml-2">{currency}{productData.price}</span>
            </div>
            <div className="overflow-x-auto mt-4">
                <table className="table-auto border-collapse w-full max-w-72 text-black dark:text-white">
                    <tbody>
                        <tr>
                            <td className="font-medium">Brand</td>
                            <td>{productData.brand}</td>
                        </tr>
                        <tr>
                            <td className="font-medium">Color</td>
                            <td>{productData.color}</td>
                        </tr>
                        <tr>
                            <td className="font-medium">Category</td>
                            <td>{productData.category}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={toggleLike}
                className={`px-3 py-1 border rounded text-sm ${
                  liked ? 'bg-black text-white' : 'bg-gray-200 text-black'
                }`}
              >
                {liked ? '♥ Liked' : '♡ Like'}
              </button>
              <span className="text-black dark:text-white text-sm">{likeCount} like{likeCount !== 1 && 's'}</span>
               {likeUsers.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {likeUsers.length === 1 ? (
                    <>Liked by {likeUsers[0].username || 'Anonymous'}</>
                  ) : (
                    <>Liked by {likeUsers[0].username || 'Anonymous'} and {likeUsers.length - 1} other{likeUsers.length - 1 > 1 ? 's' : ''}</>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex gap-4">
              <button 
              onClick={handleAddToCart} 
              disabled={productData.stock === 0}
              className="px-3 py-1 text-lg bg-orange-600 text-white border border-gray-300 rounded hover:bg-slate-50 hover:text-black cursor-pointer transition"
            >
              {productData.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
              {productData.stock > 0 && (
                <button 
                  onClick={() => router.push('/cart')} 
                  className="px-6 py-2 border border-black-600 rounded text-orange-600 hover:bg-black-50"
                >
                  Go to Cart
                </button>
              )}
            </div>

            {/* Submit Review */}
            <div className="mt-8">
              {user ? (
                <>
                  <h2 className="font-semibold mb-2 text-black dark:text-white">Leave a Review</h2>
                  <label className="flex items-center gap-2 mb-2 text-black dark:text-white" htmlFor="rating-select">
                    Rating:
                    <select
                      id="rating-select"
                      value={rating}
                      onChange={e => setRating(+e.target.value)}
                      className="border rounded p-1 text-black dark:text-white bg-white dark:bg-gray-900"
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
                    className="w-full border rounded p-2 mb-2 text-black dark:text-white bg-white dark:bg-gray-900"
                    placeholder="Your comment..."
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={loading}
                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>

                </>
              ) : (
                <p className="text-red-600">Please sign in to leave a review.</p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews List with Pagination */}
        <div className="w-full md:w-1/2">
          <div className="space-y-4">
            {[...currentReviews]
              .sort((a, b) => b.rating - a.rating)
              .map(r => {
                const foundHelpful = r.helpful?.includes(user?.id);

                return (
                  <div key={r._id} className="pb-2">
                    {/* <p className="font-semibold text-black dark:text-white">{r.userName}</p> */}
                    <div className="flex items-center gap-2 text-black dark:text-white">
                      <p className="font-semibold">{r.username}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>

                    {renderStars(r.rating)}
                    <p className="text-black dark:text-white">{r.comment}</p>

                    <div className="flex items-center gap-2 mt-2">                    
                      <button
                        onClick={() => handleHelpfulClick(r._id)}
                        className={`text-sm px-2 py-1 border rounded flex items-center gap-1 ${
                          foundHelpful ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'
                        }`}
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <span className="text-sm text-gray-600">
                        {r.helpful?.length === 1
                          ? '1 person found this helpful'
                          : `${r.helpful?.length || 0} people found this helpful`}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-black dark:text-white"
                >
                  Prev
                </button>
                <span className="text-black dark:text-white">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-black dark:text-white"
                >
                  Next
                </button>
              </div>
            )} */}
            {totalPages > 1 && (
              <div className="w-full flex justify-center mt-8">
                <div className="flex items-center flex-wrap gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow border max-w-fit">
                  {/* Prev Button */}
                  <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded border text-sm font-medium ${
                      page === 1
                        ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                        : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-100"
                    }`}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;

                    if (totalPages <= 10) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1 rounded border text-sm font-medium ${
                            page === pageNum
                              ? "bg-orange-600 text-white"
                              : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    const shouldShow =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1);

                    if (shouldShow) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1 rounded border text-sm font-medium ${
                            page === pageNum
                              ? "bg-orange-600 text-white"
                              : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    if (
                      (pageNum === 2 && page > 4) ||
                      (pageNum === totalPages - 1 && page < totalPages - 3)
                    ) {
                      return <span key={pageNum} className="px-2 text-gray-500 dark:text-gray-400">...</span>;
                    }

                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded border text-sm font-medium ${
                      page === totalPages
                        ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                        : "bg-white dark:bg-gray-900 text-gray-800 dark:text-white hover:bg-orange-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Related Products */}
        {visibleRelatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {visibleRelatedProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
  </>
);

}
