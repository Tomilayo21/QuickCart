import connectDB from '@/config/db';
import Review from '@/models/Review';
import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Unified reviews route with GET, POST, PATCH, DELETE
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();

    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');

    if (productId) {
      // Public: only approved reviews
      const reviews = await Review.find({ productId, approved: true }).sort({ createdAt: -1 });
      return NextResponse.json(reviews, { status: 200 });
    }

    // Admin: all reviews
    if (!userId || !(await authSeller(userId))) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const reviews = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    const { productId, rating, comment, userName } = await request.json();
    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return NextResponse.json({ message: 'You already submitted a review' }, { status: 400 });
    }

    const review = new Review({ productId, userId, userName, rating, comment, approved: false });
    await review.save();

    return NextResponse.json({ message: 'Review submitted for approval' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId || !(await authSeller(userId))) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const { reviewId, approved } = await request.json();
    if (!reviewId || typeof approved !== 'boolean') {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(reviewId, { approved }, { new: true });
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId || !(await authSeller(userId))) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const { reviewId } = await request.json();
    if (!reviewId) {
      return NextResponse.json({ message: 'Review ID missing' }, { status: 400 });
    }

    await Review.findByIdAndDelete(reviewId);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

