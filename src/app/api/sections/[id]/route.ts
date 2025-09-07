import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    const section = await prisma.section.findFirst({
      where: {
        id: params.id,
        resume: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!section) {
      return NextResponse.json(
        { message: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const updates = await request.json();

    // Check if the section exists and belongs to the user
    const existingSection = await prisma.section.findFirst({
      where: {
        id: params.id,
        resume: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!existingSection) {
      return NextResponse.json(
        { message: 'Section not found' },
        { status: 404 }
      );
    }

    // Update the section
    const updatedSection = await prisma.section.update({
      where: {
        id: params.id,
      },
      data: updates,
    });

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if the section exists and belongs to the user
    const section = await prisma.section.findFirst({
      where: {
        id: params.id,
        resume: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!section) {
      return NextResponse.json(
        { message: 'Section not found' },
        { status: 404 }
      );
    }

    // Delete the section
    await prisma.section.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
