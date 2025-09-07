import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Section } from '@/types/resume';
import SectionItem from './SectionItem';
import { FiPlus } from 'react-icons/fi';

interface SectionListProps {
  sections: Section[];
  activeSection: string | null;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  onMoveSection: (dragIndex: number, hoverIndex: number) => void;
  onSelectSection: (sectionId: string) => void;
}

export default function SectionList({
  sections,
  activeSection,
  onUpdateSection,
  onMoveSection,
  onSelectSection,
}: SectionListProps) {
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState('text');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'SECTION',
    drop: (item: { id: string; index: number }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionType) {
      onUpdateSection('', {
        type: newSectionType,
        title: newSectionType.charAt(0).toUpperCase() + newSectionType.slice(1),
        content: {},
        isVisible: true,
      });
      setShowAddSection(false);
    }
  };

  return (
    <div className="space-y-6">
      {sections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No sections added yet</p>
          <button
            type="button"
            onClick={() => setShowAddSection(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Your First Section
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <SectionItem
              key={section.id}
              section={section}
              index={index}
              isActive={activeSection === section.id}
              onUpdate={onUpdateSection}
              onMove={onMoveSection}
              onClick={() => onSelectSection(section.id)}
            />
          ))}
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowAddSection(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Add Section
            </button>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSection && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add New Section
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Select the type of section you'd like to add to your resume.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5">
                <form onSubmit={handleAddSection}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'profile', name: 'Profile', description: 'Personal information and summary' },
                      { id: 'experience', name: 'Experience', description: 'Work history and employment' },
                      { id: 'education', name: 'Education', description: 'Academic background' },
                      { id: 'skills', name: 'Skills', description: 'Technical and soft skills' },
                      { id: 'projects', name: 'Projects', description: 'Notable projects' },
                      { id: 'certifications', name: 'Certifications', description: 'Professional certifications' },
                    ].map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          newSectionType === type.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                        onClick={() => setNewSectionType(type.id)}
                      >
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                            newSectionType === type.id
                              ? 'border-indigo-500 bg-indigo-500 text-white'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {newSectionType === type.id && (
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M10.293 3.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L4 9.586l6.293-6.293a1 1 0 011.414 0z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">{type.name}</h4>
                            <p className="text-xs text-gray-500">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    >
                      Add Section
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSection(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
