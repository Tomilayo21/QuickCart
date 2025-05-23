'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Loading from '@/components/Loading';
import { toast } from 'react-hot-toast';

const AdminReviewsPage = () => {
  const { user, isLoaded } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check admin role (implement your own logic)
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    fetchReviews();
  }, [isLoaded, isAdmin]);

  async function fetchReviews() {
    setLoading(true);
    const res = await fetch('/api/reviews');
    const data = await res.json();
    if (data.success) {
      setReviews(data.reviews);
    }
    setLoading(false);
  }

  async function toggleApproval(reviewId, approved) {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, approved }),
      });
      if (res.ok) {
        toast.success(`Review ${approved ? 'approved' : 'disapproved'}`);
        fetchReviews();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Error toggling approval');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });
      if (res.ok) {
        toast.success('Review deleted');
        fetchReviews();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Error deleting review');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (!isLoaded) return <Loading />;

  if (!isAdmin) {
    return <p className="p-8 text-center text-red-500">Access denied. You are not an admin.</p>;
  }

  if (loading) return <Loading />;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Rating</th>
              <th className="border border-gray-300 px-4 py-2">Comment</th>
              <th className="border border-gray-300 px-4 py-2">Approved</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr key={rev._id}>
                <td className="border border-gray-300 px-4 py-2">{rev.userName}</td>
                <td className="border border-gray-300 px-4 py-2">{rev.productId}</td>
                <td className="border border-gray-300 px-4 py-2">{rev.rating}</td>
                <td className="border border-gray-300 px-4 py-2">{rev.comment}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={rev.approved}
                    onChange={() => toggleApproval(rev._id, !rev.approved)}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => deleteReview(rev._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviewsPage;
