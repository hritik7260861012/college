import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        college: {
          include: {
            courses: { take: 2 },
            reviews: { take: 2 },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      savedColleges: savedColleges.map((sc) => sc.college),
    });
  } catch (error) {
    console.error('Error fetching saved colleges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved colleges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { collegeId } = await request.json();

    if (!collegeId) {
      return NextResponse.json(
        { error: 'College ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId: user.id,
        collegeId,
      },
    });

    return NextResponse.json(savedCollege, { status: 201 });
  } catch (error) {
    console.error('Error saving college:', error);
    return NextResponse.json(
      { error: 'Failed to save college' },
      { status: 500 }
    );
  }
}
