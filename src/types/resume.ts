export interface Resume {
  id: string;
  userId: string;
  title: string;
  slug: string;
  template: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

export interface Section {
  id: string;
  resumeId: string;
  type: string;
  title: string;
  content: Record<string, any>;
  position: number;
  isVisible: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Specific section content types
export interface ProfileContent {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  photo?: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  gpa?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
  category?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Professional' | 'Native' | 'Fluent';
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

// Template types
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  preview: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

// Resume export options
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'json';
  includeContact: boolean;
  includePhoto: boolean;
  fontSize: number;
  margin: number;
  color: string;
}
