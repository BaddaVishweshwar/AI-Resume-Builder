'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiPlus, FiFileText, FiEdit2, FiTrash2, FiCopy, FiDownload, FiShare2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Resume {
  id: string;
  title: string;
  updatedAt: string;
  isPublic: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResumes();
    }
  }, [status]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      const data = await response.json();
      if (response.ok) {
        setResumes(data);
      } else {
        throw new Error(data.message || 'Failed to fetch resumes');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Resume',
          template: 'modern',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push(`/resumes/${data.id}/edit`);
      } else {
        throw new Error(data.message || 'Failed to create resume');
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResumes(resumes.filter(resume => resume.id !== id));
        toast.success('Resume deleted successfully');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handleDuplicateResume = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}/duplicate`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (response.ok) {
        setResumes([...resumes, data]);
        toast.success('Resume duplicated successfully');
      } else {
        throw new Error(data.message || 'Failed to duplicate resume');
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
        <button
          onClick={handleCreateResume}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new resume.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateResume}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 flex flex-col"
            >
              <div className="px-4 py-5 sm:p-6 flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <FiFileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {resume.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex space-x-3">
                  <Link
                    href={`/resumes/${resume.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiEdit2 className="-ml-0.5 mr-2 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDuplicateResume(resume.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiCopy className="-ml-0.5 mr-2 h-4 w-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteResume(resume.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="-ml-0.5 mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
