import { Resume as ResumeType } from '@/types/resume';
import ModernTemplate from './ModernTemplate';
import { ComponentType } from 'react';

interface ResumeTemplateProps {
  resume: ResumeType;
  className?: string;
  template?: keyof typeof templateComponents; // Only allow valid template keys
}

// Template mapping with proper typing
const templateComponents = {
  modern: ModernTemplate,
  // Add more templates here as they're created
} as const;

// Template component props type
type TemplateComponentProps = {
  resume: ResumeType;
  className?: string;
};

export default function ResumeTemplate({ 
  resume, 
  className = '', 
  template = 'modern' 
}: ResumeTemplateProps) {
  // Get the selected template component, default to modern
  const TemplateComponent = templateComponents[template] || templateComponents.modern;

  return (
    <div className={`resume-template ${className}`}>
      <TemplateComponent resume={resume} />
      
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .resume-template {
            font-size: 11pt;
            line-height: 1.5;
          }
          
          /* Common print styles that apply to all templates */
          .resume-section {
            page-break-inside: avoid;
            margin-bottom: 1.5rem;
          }
          
          a {
            color: #4f46e5;
            text-decoration: none;
          }
          
          a[href^="http"]::after {
            content: " (" attr(href) ")";
            font-size: 0.8em;
            font-weight: normal;
            color: #6b7280;
          }
          
          /* Hide print button when printing */
          .no-print, .no-print * {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
