'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiSave, FiEye, FiDownload, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

// Components
import ResumeHeader from '@/components/resume/ResumeHeader';
import SectionList from '@/components/resume/SectionList';
import SectionSidebar from '@/components/resume/SectionSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Types
import { Resume as ResumeType, Section } from '@/types/resume';

export default function ResumeEditor() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resume, setResume] = useState<ResumeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Fetch resume data
  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchResume();
    }
  }, [id, status]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setResume(data);
        // Set the first section as active by default
        if (data.sections && data.sections.length > 0) {
          setActiveSection(data.sections[0].id);
        }
      } else {
        throw new Error(data.message || 'Failed to load resume');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateResume = async (updates: Partial<ResumeType>) => {
    if (!resume) return;
    
    setResume({ ...resume, ...updates });
    
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update resume');
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<Section>) => {
    if (!resume) return;
    
    const updatedSections = resume.sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    );
    
    setResume({ ...resume, sections: updatedSections });
    saveSection(sectionId, updates);
  };

  const saveSection = async (sectionId: string, updates: Partial<Section>) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update section');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to save section');
    }
  };

  const handleMoveSection = async (dragIndex: number, hoverIndex: number) => {
    if (!resume) return;

    const newSections = [...resume.sections];
    const [movedSection] = newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, movedSection);

    // Update positions
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      position: index,
    }));

    setResume({ ...resume, sections: updatedSections });

    // Save the new order
    try {
      await Promise.all(
        updatedSections.map(section =>
          fetch(`/api/sections/${section.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ position: section.position }),
          })
        )
      );
    } catch (error) {
      console.error('Error reordering sections:', error);
      toast.error('Failed to reorder sections');
    }
  };

  const handleAddSection = async (type: string) => {
    if (!resume) return;

    const newSection = {
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: getDefaultContentForType(type),
      position: resume.sections.length,
      isVisible: true,
    };

    try {
      const response = await fetch(`/api/resumes/${id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSection),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResume({
          ...resume,
          sections: [...resume.sections, data],
        });
        setActiveSection(data.id);
      } else {
        throw new Error(data.message || 'Failed to add section');
      }
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('Failed to add section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!resume) return;

    if (!confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedSections = resume.sections.filter(section => section.id !== sectionId);
        setResume({
          ...resume,
          sections: updatedSections,
        });
        
        // Set a new active section if needed
        if (activeSection === sectionId) {
          setActiveSection(updatedSections.length > 0 ? updatedSections[0].id : null);
        }
        
        toast.success('Section deleted');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete section');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
    }
  };

  const getDefaultContentForType = (type: string) => {
    switch (type) {
      case 'profile':
        return {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          summary: '',
        };
      case 'experience':
        return {
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
        };
      case 'education':
        return {
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
        };
      case 'skills':
        return {
          items: [
            {
              id: `skill-${Date.now()}`,
              name: '',
              level: 3,
            },
          ],
        };
      case 'projects':
        return {
          items: [
            {
              id: `proj-${Date.now()}`,
              name: '',
              description: '',
              url: '',
            },
          ],
        };
      default:
        return {};
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Resume not found</h2>
        <p className="mt-2 text-gray-600">The requested resume could not be loaded.</p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiChevronLeft className="-ml-1 mr-2 h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center
              ">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </Link>
                <h1 className="ml-4 text-lg font-medium text-gray-900">
                  {resume.title}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // Toggle preview mode
                    router.push(`/resumes/${id}/preview`);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiEye className="-ml-1 mr-2 h-5 w-5" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Handle download
                    console.log('Download PDF');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiDownload className="-ml-1 mr-2 h-5 w-5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <SectionSidebar
            onAddSection={handleAddSection}
            sections={resume.sections}
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            onDeleteSection={handleDeleteSection}
          />

          {/* Main editor area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              <ResumeHeader
                title={resume.title}
                onUpdateTitle={(title) => handleUpdateResume({ title })}
              />
              
              <SectionList
                sections={resume.sections}
                activeSection={activeSection}
                onUpdateSection={handleUpdateSection}
                onMoveSection={handleMoveSection}
                onSelectSection={setActiveSection}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
