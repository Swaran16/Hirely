import { Storage } from "@plasmohq/storage";
import type { UserProfile, JobDescription } from "../types";

export const storage = new Storage();

// Profile operations
export const saveProfile = async (profile: UserProfile): Promise<void> => {
  await storage.set("userProfile", profile);
};

export const getProfile = async (): Promise<UserProfile | null> => {
  const profile = await storage.get<UserProfile>("userProfile");
  return profile ?? null;
};

// Auth operations
export const saveAuthToken = async (token: string): Promise<void> => {
  await storage.set("authToken", token);
};

export const getAuthToken = async (): Promise<string | null> => {
  const token = await storage.get<string>("authToken");
  return token ?? null;
};

export const clearAuth = async (): Promise<void> => {
  await storage.remove("authToken");
  await storage.remove("userProfile");
};

// JD Cache (to avoid re-analyzing same job)
export const cacheJD = async (url: string, jd: JobDescription): Promise<void> => {
  const cache = (await storage.get<Record<string, any>>("jdCache")) || {};
  cache[url] = { ...jd, cachedAt: Date.now() };
  await storage.set("jdCache", cache);
};

export const getCachedJD = async (url: string): Promise<JobDescription | null> => {
  const cache = (await storage.get<Record<string, any>>("jdCache")) || {};
  const cached = cache[url];
  
  // Cache expires after 1 hour
  if (cached && Date.now() - cached.cachedAt < 3600000) {
    return cached;
  }
  
  return null;
};

// Match results cache
export const cacheMatchResult = async (url: string, result: any): Promise<void> => {
  const cache = (await storage.get<Record<string, any>>("matchCache")) || {};
  cache[url] = { ...result, cachedAt: Date.now() };
  await storage.set("matchCache", cache);
};

export const getCachedMatchResult = async (url: string): Promise<any | null> => {
  const cache = (await storage.get<Record<string, any>>("matchCache")) || {};
  const cached = cache[url];
  
  if (cached && Date.now() - cached.cachedAt < 3600000) {
    return cached;
  }
  
  return null;
};