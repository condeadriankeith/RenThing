import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logger } from "@/lib/logger";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const reviewId = params.id;
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { user: { select: { id: true, name: true } }, listing: { select: { id: true, title: true } } },
    });

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    logger.error('Reviews GET by ID error', error as Error, { context: 'reviews' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;
    const { rating, comment } = await request.json();

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating !== undefined ? rating : existingReview.rating,
        comment: comment !== undefined ? comment : existingReview.comment,
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    logger.error('Reviews PUT error', error as Error, { context: 'reviews' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    logger.error('Reviews DELETE error', error as Error, { context: 'reviews' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}