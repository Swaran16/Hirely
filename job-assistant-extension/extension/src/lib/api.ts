import axios from 'axios';
import { API_BASE_URL } from './constants';
import { getAuthToken } from './storage';
import type { UserProfile, JobDescription, AuthResponse } from '../types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  // Profile
  saveProfile: (profile: UserProfile) =>
    apiClient.post('/profile', profile),

  getProfile: () =>
    apiClient.get<UserProfile>('/profile'),

  updateProfile: (profile: Partial<UserProfile>) =>
    apiClient.put('/profile', profile),

  // Resume
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return apiClient.post('/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Job Analysis
  analyzeMatch: (jd: JobDescription, profile: UserProfile) =>
    apiClient.post('/jobs/analyze', { jd, profile }),

  trackApplication: (jobTitle: string, company: string, jobUrl?: string) =>
    apiClient.post('/jobs/track', { jobTitle, company, jobUrl }),

  getApplications: () =>
    apiClient.get('/jobs/applications'),

  // AI Generation
  generateAnswer: (question: string, jd: JobDescription, profile: UserProfile) =>
    apiClient.post('/ai/generate-answer', { question, jd, profile }),

  getSuggestions: (jd: JobDescription, profile: UserProfile) =>
    apiClient.post('/ai/suggestions', { jd, profile }),

  improveResume: (profile: UserProfile, jd: JobDescription) =>
    apiClient.post('/ai/improve-resume', { profile, jd }),
};