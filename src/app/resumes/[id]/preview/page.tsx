'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  FiDownload, 
  FiEdit, 
  FiShare2, 
  FiChevronLeft, 
  FiPrinter, 
  FiLayout,
  FiRotateCw
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

// Components
import ResumeTemplate from '@/components/resume/templates/ResumeTemplate';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TemplateSelector, { TemplateId } from '@/components/resume/TemplateSelector';

// Types
import { Resume as ResumeType } from '@/types/resume';

// Template components
import ModernTemplate from '@/components/resume/templates/ModernTemplate';

// Template mapping with proper typing
const templateComponents = {
  modern: ModernTemplate,
  professional: ModernTemplate, // TODO: Replace with actual ProfessionalTemplate
  minimal: ModernTemplate,      // TODO: Replace with actual MinimalTemplate
  creative: ModernTemplate,     // TODO: Replace with actual CreativeTemplate
} as const;

export default function ResumePreview() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resume, setResume] = useState<ResumeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle authentication status
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && id) {
      fetchResume();
    }
  }, [id, status, router]);

  // Show loading state while checking auth status
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const fetchResume = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/resumes/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setResume(data);
        // Load saved template preference if exists
        if (data.template) {
          setSelectedTemplate(data.template);
        }
      } else {
        throw new Error(data.message || 'Failed to load resume');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleTemplateChange = async (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    
    // Save template preference to the resume
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...resume,
          template: templateId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update template preference');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to save template preference');
    }
  };
  
  const handleRefresh = () => {
    fetchResume();
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // In a real app, this would generate a PDF
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('PDF download started');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: resume?.title || 'My Resume',
          text: `Check out my resume: ${resume?.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error: unknown) {
      console.error('Error sharing:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="h-12 bg-gray-200 rounded-md w-1/3 mb-8"></div>
          
          {/* Toolbar Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 bg-gray-200 rounded-md w-32"></div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="bg-white rounded-lg shadow p-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              
              <div className="pt-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-gray-200 pt-6">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Resume Not Found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find the resume you're looking for. It may have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => fetchResume()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRotateCw className="mr-2 h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiChevronLeft className="-ml-1 mr-2 h-5 w-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Link
                href={`/resumes/${id}/edit`}
                className="text-gray-500 hover:text-gray-700"
                title="Back to editor"
              >
                <FiChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="ml-2 text-lg font-medium text-gray-900">
                {resume.title}
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="w-full sm:w-64">
                <TemplateSelector 
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleTemplateChange}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  title="Refresh resume"
                >
                  <FiRotateCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Share resume"
                >
                  <FiShare2 className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Print resume"
                >
                  <FiPrinter className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  title="Download PDF"
                >
                  <FiDownload className="h-5 w-5" />
                </button>
                
                <Link
                  href={`/resumes/${id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Edit resume"
                >
                  <FiEdit className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 print:py-0 print:px-0">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none transition-all duration-200">
          {(() => {
            // Get the selected template component
            const SelectedTemplate = templateComponents[selectedTemplate] || templateComponents.modern;
            
            // Early return if resume is null (shouldn't happen at this point due to previous check)
            if (!resume) {
              return null;
            }
            return (
              <SelectedTemplate 
                resume={resume} 
                className={isRefreshing ? 'opacity-75' : 'opacity-100'}
              />
            );
          })()}
        </div>
        
        {/* Template Info */}
        <div className="mt-4 text-center text-sm text-gray-500 print:hidden">
          <p>Using template: <span className="font-medium">{selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}</span></p>
          <p className="mt-1">Changes are saved automatically</p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          .print\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          .print\:shadow-none {
            box-shadow: none !important;
          }
          
          /* Hide elements with print:hidden */
          .print\:hidden, .no-print {
            display: none !important;
          }
          
          /* Ensure links are visible in print */
          a {
            color: #4f46e5 !important;
            text-decoration: none !important;
          }
          
          /* Add URL after links in print */
          a[href^="http"]:after {
            content: " (" attr(href) ")" !important;
            font-size: 0.8em !important;
            font-weight: normal !important;
            color: #6b7280 !important;
          }
          
          /* Ensure proper page breaks */
          .break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Reset background colors for print */
          .bg-white {
            background-color: white !important;
          }
          
          .text-gray-900 {
            color: #111827 !important;
          }
          
          .text-gray-700 {
            color: #374151 !important;
          }
          
          .text-gray-600 {
            color: #4b5563 !important;
          }
          
          .text-indigo-600 {
            color: #4f46e5 !important;
          }
        }
      `}</style>
    </div>
  );
}
