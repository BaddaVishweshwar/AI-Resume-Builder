import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, title, content, position, isVisible } = await request.json();

    // Check if the resume exists and belongs to the user
    const resume = await prisma.resume.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: 'Resume not found' },
        { status: 404 }
      );
    }

    // Create a new section
    const section = await prisma.section.create({
      data: {
        type,
        title: title || type.charAt(0).toUpperCase() + type.slice(1),
        content: content || {},
        position: position !== undefined ? position : 0,
        isVisible: isVisible !== undefined ? isVisible : true,
        resume: {
          connect: {
            id: params.id,
          },
        },
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
