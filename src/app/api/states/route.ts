import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const states = await prisma.college.groupBy({
      by: ['state'],
      _count: {
        state: true,
      },
      orderBy: {
        state: 'asc',
      },
    });

    return NextResponse.json(
      states.map((s) => ({
        name: s.state,
        count: s._count.state,
      }))
    );
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch states' },
      { status: 500 }
    );
  }
}