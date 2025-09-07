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

    const resume = await prisma.resume.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
      include: {
        sections: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
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

    const data = await request.json();

    // Check if the resume exists and belongs to the user
    const existingResume = await prisma.resume.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!existingResume) {
      return NextResponse.json(
        { message: 'Resume not found' },
        { status: 404 }
      );
    }

    // Update the resume
    const updatedResume = await prisma.resume.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        template: data.template,
        isPublic: data.isPublic,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedResume);
  } catch (error) {
    console.error('Error updating resume:', error);
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

    // Check if the resume exists and belongs to the user
    const existingResume = await prisma.resume.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!existingResume) {
      return NextResponse.json(
        { message: 'Resume not found' },
        { status: 404 }
      );
    }

    // Delete the resume and its sections
    await prisma.$transaction([
      prisma.section.deleteMany({
        where: {
          resumeId: params.id,
        },
      }),
      prisma.resume.delete({
        where: {
          id: params.id,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
