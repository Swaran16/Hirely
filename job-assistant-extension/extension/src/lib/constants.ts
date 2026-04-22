export const API_BASE_URL = process.env.PLASMO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const SUPPORTED_JOB_SITES = [
  'linkedin.com',
  'indeed.com',
  'naukri.com',
  'glassdoor.com',
  'monster.com'
];

export const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
  'React', 'Angular', 'Vue', 'Node.js', 'Express',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'REST API', 'GraphQL', 'Git', 'CI/CD',
  'HTML', 'CSS', 'Tailwind', 'Bootstrap',
  'Machine Learning', 'TensorFlow', 'PyTorch',
  'Spring Boot', 'Django', 'Flask', 'FastAPI'
];

export const EXPERIENCE_LEVELS = [
  'Fresher',
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-8 years',
  '8+ years'
];