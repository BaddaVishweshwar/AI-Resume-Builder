'use client';

import { useState, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';

// Template types
type TemplateType = {
  id: TemplateId;
  name: string;
  description: string;
  previewImage?: string;
  category: 'professional' | 'creative' | 'minimal' | 'modern';
};

// Available templates
const TEMPLATES: TemplateType[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with a two-column layout',
    category: 'modern',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Classic and formal design for traditional industries',
    category: 'professional',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean design with maximum readability',
    category: 'minimal',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design with creative elements',
    category: 'creative',
  },
];

export type TemplateId = 'modern' | 'professional' | 'minimal' | 'creative';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  className?: string;
}

export default function TemplateSelector({ 
  selectedTemplate, 
  onSelectTemplate,
  className 
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<TemplateType>(
    () => TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0]
  );

  // Update selected template when prop changes
  useEffect(() => {
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    if (template) {
      setSelected(template);
    }
  }, [selectedTemplate]);

  const handleSelect = (template: TemplateType) => {
    setSelected(template);
    onSelectTemplate(template.id);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">
          {selected?.name || 'Select a template'}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={cn(
                'cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50',
                selected?.id === template.id ? 'text-indigo-900' : 'text-gray-900'
              )}
              onClick={() => handleSelect(template)}
            >
              <div className="flex items-center">
                <span className={cn('block truncate', selected?.id === template.id ? 'font-semibold' : 'font-normal')}>
                  {template.name}
                </span>
                {selected?.id === template.id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                    <FiCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {template.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
