import { useState, useEffect } from 'react';
import { FiSave, FiTrash2, FiPlus, FiX, FiChevronDown, FiChevronUp, FiMove } from 'react-icons/fi';
import { Section } from '@/types/resume';
import { cn } from '@/lib/utils';

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function SectionEditor({
  section,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Section>>(section);
  const [isExpanded, setIsExpanded] = useState(true);

  // Update form data when section prop changes
  useEffect(() => {
    setFormData(section);
  }, [section]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const renderEditor = () => {
    if (!isEditing) {
      return (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              {section.content && (
                <div className="mt-2 text-sm text-gray-600">
                  {section.type === 'profile' && (
                    <p>{section.content.summary || 'No summary provided'}</p>
                  )}
                  {section.type === 'experience' && section.content.items && (
                    <div className="space-y-2">
                      {section.content.items.slice(0, 2).map((item: any, index: number) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-3">
                          <p className="font-medium">{item.jobTitle || 'Untitled Position'}</p>
                          <p className="text-sm">{item.employer}</p>
                        </div>
                      ))}
                      {section.content.items.length > 2 && (
                        <p className="text-xs text-gray-500">+{section.content.items.length - 2} more items</p>
                      )}
                    </div>
                  )}
                  {section.type === 'education' && section.content.items && (
                    <div className="space-y-2">
                      {section.content.items.slice(0, 2).map((item: any, index: number) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-3">
                          <p className="font-medium">{item.degree || 'Degree'}</p>
                          <p className="text-sm">{item.school}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.type === 'skills' && section.content.items && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {section.content.items.slice(0, 5).map((skill: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill.name || 'Skill'}
                        </span>
                      ))}
                      {section.content.items.length > 5 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{section.content.items.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none"
                title="Edit section"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1 text-gray-400 hover:text-red-500 focus:outline-none"
                title="Remove section"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Render different forms based on section type
    switch (section.type) {
      case 'profile':
        return renderProfileEditor();
      case 'experience':
        return renderExperienceEditor();
      case 'education':
        return renderEducationEditor();
      case 'skills':
        return renderSkillsEditor();
      default:
        return renderGenericEditor();
    }
  };

  const renderProfileEditor = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.content?.fullName || ''}
            onChange={(e) => handleContentChange('fullName', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.content?.email || ''}
              onChange={(e) => handleContentChange('email', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.content?.phone || ''}
              onChange={(e) => handleContentChange('phone', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.content?.location || ''}
            onChange={(e) => handleContentChange('location', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website/Portfolio
          </label>
          <input
            type="url"
            name="website"
            id="website"
            value={formData.content?.website || ''}
            onChange={(e) => handleContentChange('website', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <textarea
            name="summary"
            id="summary"
            rows={4}
            value={formData.content?.summary || ''}
            onChange={(e) => handleContentChange('summary', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderExperienceEditor = () => {
    const items = formData.content?.items || [];
    
    const addExperience = () => {
      const newItem = {
        id: `exp-${Date.now()}`,
        jobTitle: '',
        employer: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
      handleContentChange('items', [...items, newItem]);
    };

    const updateExperience = (index: number, updates: any) => {
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], ...updates };
      handleContentChange('items', updatedItems);
    };

    const removeExperience = (index: number) => {
      const updatedItems = items.filter((_, i) => i !== index);
      handleContentChange('items', updatedItems);
    };

    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {items.map((item: any, index: number) => (
          <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 relative">
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              title="Remove experience"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`jobTitle-${index}`} className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id={`jobTitle-${index}`}
                    value={item.jobTitle || ''}
                    onChange={(e) => updateExperience(index, { jobTitle: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`employer-${index}`} className="block text-sm font-medium text-gray-700">
                    Employer
                  </label>
                  <input
                    type="text"
                    id={`employer-${index}`}
                    value={item.employer || ''}
                    onChange={(e) => updateExperience(index, { employer: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`location-${index}`} className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id={`location-${index}`}
                  value={item.location || ''}
                  onChange={(e) => updateExperience(index, { location: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="month"
                    id={`startDate-${index}`}
                    value={item.startDate || ''}
                    onChange={(e) => updateExperience(index, { startDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="flex items-center">
                    <input
                      type="month"
                      id={`endDate-${index}`}
                      value={item.current ? '' : item.endDate || ''}
                      onChange={(e) => updateExperience(index, { endDate: e.target.value, current: false })}
                      disabled={item.current}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                    <div className="ml-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={item.current || false}
                        onChange={(e) => updateExperience(index, { current: e.target.checked, endDate: '' })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                        Current
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  rows={3}
                  value={item.description || ''}
                  onChange={(e) => updateExperience(index, { description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="-ml-0.5 mr-2 h-4 w-4" />
          Add Experience
        </button>
      </div>
    );
  };

  const renderEducationEditor = () => {
    const items = formData.content?.items || [];
    
    const addEducation = () => {
      const newItem = {
        id: `edu-${Date.now()}`,
        degree: '',
        school: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
      handleContentChange('items', [...items, newItem]);
    };

    const updateEducation = (index: number, updates: any) => {
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], ...updates };
      handleContentChange('items', updatedItems);
    };

    const removeEducation = (index: number) => {
      const updatedItems = items.filter((_, i) => i !== index);
      handleContentChange('items', updatedItems);
    };

    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {items.map((item: any, index: number) => (
          <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 relative">
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              title="Remove education"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    type="text"
                    id={`degree-${index}`}
                    value={item.degree || ''}
                    onChange={(e) => updateEducation(index, { degree: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`school-${index}`} className="block text-sm font-medium text-gray-700">
                    School/Institution
                  </label>
                  <input
                    type="text"
                    id={`school-${index}`}
                    value={item.school || ''}
                    onChange={(e) => updateEducation(index, { school: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`location-${index}`} className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id={`location-${index}`}
                  value={item.location || ''}
                  onChange={(e) => updateEducation(index, { location: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="month"
                    id={`startDate-${index}`}
                    value={item.startDate || ''}
                    onChange={(e) => updateEducation(index, { startDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="flex items-center">
                    <input
                      type="month"
                      id={`endDate-${index}`}
                      value={item.current ? '' : item.endDate || ''}
                      onChange={(e) => updateEducation(index, { endDate: e.target.value, current: false })}
                      disabled={item.current}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                    <div className="ml-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={item.current || false}
                        onChange={(e) => updateEducation(index, { current: e.target.checked, endDate: '' })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                        Currently Enrolled
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  id={`description-${index}`}
                  rows={2}
                  value={item.description || ''}
                  onChange={(e) => updateEducation(index, { description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Honors, awards, relevant coursework, etc."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="-ml-0.5 mr-2 h-4 w-4" />
          Add Education
        </button>
      </div>
    );
  };

  const renderSkillsEditor = () => {
    const items = formData.content?.items || [];
    
    const addSkill = () => {
      const newItem = {
        id: `skill-${Date.now()}`,
        name: '',
        level: 3,
        category: ''
      };
      handleContentChange('items', [...items, newItem]);
    };

    const updateSkill = (index: number, updates: any) => {
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], ...updates };
      handleContentChange('items', updatedItems);
    };

    const removeSkill = (index: number) => {
      const updatedItems = items.filter((_, i) => i !== index);
      handleContentChange('items', updatedItems);
    };

    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="space-y-3">
            {items.map((item: any, index: number) => (
              <div key={item.id} className="flex items-start space-x-2 group">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => updateSkill(index, { name: e.target.value })}
                    placeholder="Skill name"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <select
                    value={item.level || 3}
                    onChange={(e) => updateSkill(index, { level: parseInt(e.target.value) })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={1}>Beginner</option>
                    <option value={2}>Basic</option>
                    <option value={3}>Intermediate</option>
                    <option value={4}>Advanced</option>
                    <option value={5}>Expert</option>
                  </select>
                  <input
                    type="text"
                    value={item.category || ''}
                    onChange={(e) => updateSkill(index, { category: e.target.value })}
                    placeholder="Category (optional)"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove skill"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={addSkill}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="-ml-0.5 mr-2 h-4 w-4" />
          Add Skill
        </button>
      </div>
    );
  };

  const renderGenericEditor = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Section Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          name="content"
          id="content"
          rows={8}
          value={JSON.stringify(formData.content, null, 2)}
          readOnly
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-xs bg-gray-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          This section type doesn't have a custom editor yet. The raw content is shown above.
        </p>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isExpanded ? (
              <FiChevronDown className="h-5 w-5" />
            ) : (
              <FiChevronUp className="h-5 w-5" />
            )}
          </button>
          <h3 className="text-lg font-medium text-gray-900">{section.title || 'Untitled Section'}</h3>
        </div>
        <div className="flex space-x-2">
          {!isFirst && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="text-gray-400 hover:text-indigo-600 focus:outline-none"
              title="Move up"
            >
              <FiChevronUp className="h-5 w-5" />
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="text-gray-400 hover:text-indigo-600 focus:outline-none"
              title="Move down"
            >
              <FiChevronDown className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-gray-400 hover:text-red-500 focus:outline-none"
            title="Remove section"
          >
            <FiTrash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-6 border-l-2 border-gray-200">
          {renderEditor()}
          
          {isEditing && (
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiSave className="-ml-1 mr-2 h-5 w-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
