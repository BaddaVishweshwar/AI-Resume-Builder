import { Resume as ResumeType } from '@/types/resume';
import { formatDate, formatDateRange } from '@/lib/utils';

interface ModernTemplateProps {
  resume: ResumeType;
  className?: string;
}

export default function ModernTemplate({ resume, className = '' }: ModernTemplateProps) {
  // Group sections by type for easier rendering
  const sectionsByType = resume.sections.reduce((acc, section) => {
    if (!acc[section.type]) {
      acc[section.type] = [];
    }
    acc[section.type].push(section);
    return acc;
  }, {} as Record<string, typeof resume.sections>);

  // Get profile section if it exists
  const profileSection = sectionsByType['profile']?.[0];
  const profile = profileSection?.content || {};

  // Get other sections, excluding profile
  const otherSections = Object.entries(sectionsByType)
    .filter(([type]) => type !== 'profile')
    .map(([_, sections]) => sections[0]);

  return (
    <div className={`modern-resume bg-white text-gray-800 ${className}`}>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header with contact info */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {profile.fullName || 'Your Name'}
          </h1>
          
          {profile.title && (
            <h2 className="text-xl text-indigo-600 font-medium mb-4">
              {profile.title}
            </h2>
          )}
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 transition-colors">
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <span>{profile.phone}</span>
            )}
            {profile.location && (
              <span>{profile.location}</span>
            )}
            {profile.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          
          {profile.summary && (
            <div className="mt-6 text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {profile.summary}
            </div>
          )}
        </header>

        {/* Main content - 2 column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience */}
            {sectionsByType.experience?.map((section, sectionIndex) => (
              <section key={sectionIndex} className="resume-section">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 mb-4">
                  {section.title || 'Professional Experience'}
                </h2>
                <div className="space-y-6">
                  {section.content?.items?.map((item: any, index: number) => (
                    <div key={index} className="resume-item pl-4 border-l-2 border-indigo-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.jobTitle || 'Job Title'}
                          </h3>
                          <div className="text-indigo-700 font-medium">
                            {item.employer}
                            {item.location && ` • ${item.location}`}
                          </div>
                        </div>
                        <div className="text-gray-600 text-sm sm:text-base whitespace-nowrap sm:ml-4 mt-1 sm:mt-0">
                          {formatDateRange(item.startDate, item.endDate, item.current)}
                        </div>
                      </div>
                      
                      {item.description && (
                        <div className="mt-2 text-gray-700">
                          {item.description}
                        </div>
                      )}
                      
                      {item.highlights?.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {item.highlights.map((highlight: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-indigo-500 mr-2 mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Projects */}
            {sectionsByType.projects?.map((section, sectionIndex) => (
              <section key={sectionIndex} className="resume-section">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 mb-4">
                  {section.title || 'Projects'}
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {section.content?.items?.map((project: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.name || 'Project Name'}
                            {project.url && (
                              <a 
                                href={project.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-sm font-normal text-indigo-600 hover:underline"
                              >
                                (View Project)
                              </a>
                            )}
                          </h3>
                          {project.technologies?.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {project.technologies.map((tech: string, i: number) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {project.startDate && (
                          <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                            {formatDateRange(project.startDate, project.endDate, false)}
                          </div>
                        )}
                      </div>
                      
                      {project.description && (
                        <div className="mt-2 text-gray-700">
                          {project.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Skills */}
            {sectionsByType.skills?.map((section, sectionIndex) => (
              <section key={sectionIndex} className="resume-section">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 mb-4">
                  {section.title || 'Skills'}
                </h2>
                <div className="space-y-4">
                  {section.content?.items?.reduce((acc: any, skill: any) => {
                    const category = skill.category || 'Other';
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push(skill);
                    return acc;
                  }, {})?.map(([category, skills]: [string, any[]], i: number) => (
                    <div key={i}>
                      <h3 className="font-semibold text-gray-700 mb-1">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: any, j: number) => (
                          <span 
                            key={j} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Education */}
            {sectionsByType.education?.map((section, sectionIndex) => (
              <section key={sectionIndex} className="resume-section">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 mb-4">
                  {section.title || 'Education'}
                </h2>
                <div className="space-y-4">
                  {section.content?.items?.map((item: any, index: number) => (
                    <div key={index} className="pl-3 border-l-2 border-indigo-200">
                      <h3 className="font-semibold text-gray-900">
                        {item.degree}
                      </h3>
                      <div className="text-indigo-700">
                        {item.school}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDateRange(item.startDate, item.endDate, item.current)}
                      </div>
                      {item.gpa && (
                        <div className="text-sm text-gray-700 mt-1">
                          GPA: {item.gpa}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Other sections */}
            {otherSections
              .filter(section => !['experience', 'education', 'skills', 'projects', 'profile'].includes(section.type))
              .map((section, index) => (
                <section key={index} className="resume-section">
                  <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-2 mb-4">
                    {section.title || 'Section'}
                  </h2>
                  {section.content?.items ? (
                    <div className="space-y-4">
                      {section.content.items.map((item: any, i: number) => (
                        <div key={i} className="pl-3 border-l-2 border-indigo-100">
                          <h3 className="font-semibold text-gray-900">
                            {item.name || item.title || 'Item'}
                            {item.date && (
                              <span className="ml-2 text-gray-600 text-sm font-normal">
                                {formatDate(item.date)}
                              </span>
                            )}
                          </h3>
                          {(item.issuer || item.organization || item.publisher) && (
                            <div className="text-indigo-700">
                              {item.issuer || item.organization || item.publisher}
                            </div>
                          )}
                          {item.description && (
                            <div className="mt-1 text-sm text-gray-700">
                              {item.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-700 whitespace-pre-line text-sm">
                      {typeof section.content === 'string' 
                        ? section.content 
                        : JSON.stringify(section.content, null, 2)
                      }
                    </div>
                  )}
                </section>
              ))}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .modern-resume {
            font-size: 10pt;
            line-height: 1.4;
          }
          
          .modern-resume a {
            text-decoration: none;
            color: #4f46e5;
          }
          
          .modern-resume .resume-section {
            page-break-inside: avoid;
            margin-bottom: 1rem;
          }
          
          .modern-resume h1 {
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
          }
          
          .modern-resume h2 {
            font-size: 1.3rem;
            margin-top: 1.2rem;
            margin-bottom: 0.75rem;
          }
          
          .modern-resume h3 {
            font-size: 1.1rem;
            margin-bottom: 0.25rem;
          }
          
          .modern-resume p, 
          .modern-resume li, 
          .modern-resume div {
            font-size: 0.9rem;
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
