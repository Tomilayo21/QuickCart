import connectDB from '@/config/db';
import Review from '@/models/Review';
import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const { reviewId, approved } = await request.json();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { approved },
      { new: true }
    );

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const { reviewId } = await request.json();

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
