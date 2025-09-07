import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resumes = await prisma.resume.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        isPublic: true,
      },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, template } = await request.json();

    // Get the user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Create a new resume with default sections
    const resume = await prisma.resume.create({
      data: {
        title: title || 'Untitled Resume',
        template: template || 'modern',
        slug: `resume-${Date.now()}`,
        user: {
          connect: {
            id: user.id,
          },
        },
        sections: {
          create: [
            {
              type: 'profile',
              title: 'Personal Information',
              position: 1,
              content: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                website: '',
                summary: '',
              },
            },
            {
              type: 'experience',
              title: 'Work Experience',
              position: 2,
              content: {
                items: [
                  {
                    id: `exp-${Date.now()}`,
                    jobTitle: '',
                    employer: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                  },
                ],
              },
            },
            {
              type: 'education',
              title: 'Education',
              position: 3,
              content: {
                items: [
                  {
                    id: `edu-${Date.now()}`,
                    degree: '',
                    school: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                  },
                ],
              },
            },
            {
              type: 'skills',
              title: 'Skills',
              position: 4,
              content: {
                items: [
                  {
                    id: `skill-${Date.now()}`,
                    name: '',
                    level: 3,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
