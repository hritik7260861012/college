import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const minFees = searchParams.get('minFees') ? parseFloat(searchParams.get('minFees')!) : undefined;
    const maxFees = searchParams.get('maxFees') ? parseFloat(searchParams.get('maxFees')!) : undefined;
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;

    const skip = (page - 1) * limit;

    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (state) {
      where.state = state;
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.fees = {};
      if (minFees !== undefined) where.fees.gte = minFees;
      if (maxFees !== undefined) where.fees.lte = maxFees;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ranking: 'asc' },
        include: {
          courses: {
            take: 3,
          },
          reviews: {
            take: 2,
          },
        },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
}
