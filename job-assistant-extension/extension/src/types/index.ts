export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  projects: Project[];
  education: Education[];
  resumeText?: string;
  resumeUrl?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface JobDescription {
  title: string;
  company: string;
  skills: string[];
  description: string;
  url: string;
  location?: string;
  salary?: string;
  extractedAt: string;
}

export interface MatchResult {
  score: number;
  selectionChance: 'Low' | 'Medium' | 'High';
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
}

export interface FormField {
  type: string;
  label: string;
  element: HTMLInputElement | HTMLTextAreaElement;
  value?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}