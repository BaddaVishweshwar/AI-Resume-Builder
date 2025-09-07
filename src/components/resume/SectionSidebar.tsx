import { useState } from 'react';
import { FiPlus, FiX, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { Section } from '@/types/resume';

interface SectionSidebarProps {
  onAddSection: (type: string) => void;
  sections: Section[];
  activeSection: string | null;
  onSelectSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export default function SectionSidebar({
  onAddSection,
  sections,
  activeSection,
  onSelectSection,
  onDeleteSection,
}: SectionSidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    basic: true,
    work: true,
    education: true,
    skills: true,
    other: true,
  });

  const sectionGroups = {
    basic: [
      { id: 'profile', name: 'Profile', icon: '👤', description: 'Personal information and summary' },
    ],
    work: [
      { id: 'experience', name: 'Work Experience', icon: '💼', description: 'Your work history' },
    ],
    education: [
      { id: 'education', name: 'Education', icon: '🎓', description: 'Your educational background' },
    ],
    skills: [
      { id: 'skills', name: 'Skills', icon: '🛠️', description: 'Your skills and expertise' },
    ],
    other: [
      { id: 'projects', name: 'Projects', icon: '📂', description: 'Notable projects' },
      { id: 'certifications', name: 'Certifications', icon: '🏆', description: 'Professional certifications' },
      { id: 'languages', name: 'Languages', icon: '🌐', description: 'Language proficiencies' },
      { id: 'publications', name: 'Publications', icon: '📝', description: 'Published works' },
      { id: 'volunteer', name: 'Volunteer Work', icon: '🤝', description: 'Volunteer experience' },
    ],
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleAddSection = (type: string) => {
    onAddSection(type);
    setIsAdding(false);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Sections</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add and organize your resume sections
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
              Add Section
            </button>
          ) : (
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Add Section</h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-2 space-y-1">
                {Object.entries(sectionGroups).map(([group, items]) => (
                  <div key={group} className="mb-2">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2 py-1 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
                      onClick={() => toggleGroup(group)}
                    >
                      <span className="capitalize">{group}</span>
                      {expandedGroups[group] ? (
                        <FiChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <FiChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    {expandedGroups[group] && (
                      <div className="mt-1 space-y-1 pl-2">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="w-full flex items-center px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                            onClick={() => handleAddSection(item.id)}
                          >
                            <span className="mr-2 text-base">{item.icon}</span>
                            <span>{item.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-2">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Current Sections
          </h3>
          <nav className="mt-1 space-y-1">
            {sections.length === 0 ? (
              <div className="px-2 py-3 text-center text-sm text-gray-500">
                No sections added yet
              </div>
            ) : (
              sections.map((section) => {
                const sectionInfo = Object.values(sectionGroups)
                  .flat()
                  .find((s) => s.id === section.type) || {
                  icon: '📄',
                  name: section.type,
                };

                return (
                  <div
                    key={section.id}
                    className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <button
                      type="button"
                      className="flex-1 flex items-center text-left"
                      onClick={() => onSelectSection(section.id)}
                    >
                      <span className="mr-2 text-base">{sectionInfo.icon}</span>
                      <span className="truncate">{section.title}</span>
                    </button>
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSection(section.id);
                      }}
                      title="Remove section"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
