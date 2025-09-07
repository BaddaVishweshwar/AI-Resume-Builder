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

    // Get the original resume with its sections
    const originalResume = await prisma.resume.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email,
        },
      },
      include: {
        sections: true,
      },
    });

    if (!originalResume) {
      return NextResponse.json(
        { message: 'Resume not found' },
        { status: 404 }
      );
    }

    // Create a new copy of the resume
    const newResume = await prisma.$transaction(async (tx) => {
      // Create the new resume
      const resume = await tx.resume.create({
        data: {
          title: `${originalResume.title} (Copy)`,
          slug: `${originalResume.slug}-copy-${Date.now()}`,
          template: originalResume.template,
          isPublic: false,
          user: {
            connect: {
              email: session.user!.email!,
            },
          },
        },
      });

      // Copy all sections
      if (originalResume.sections.length > 0) {
        await tx.section.createMany({
          data: originalResume.sections.map((section) => ({
            resumeId: resume.id,
            type: section.type,
            title: section.title,
            content: section.content,
            position: section.position,
            isVisible: section.isVisible,
          })),
        });
      }

      // Return the new resume with its sections
      return tx.resume.findUnique({
        where: { id: resume.id },
        include: {
          sections: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      });
    });

    return NextResponse.json(newResume);
  } catch (error) {
    console.error('Error duplicating resume:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
