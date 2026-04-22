import { create } from 'zustand';
import { UserProfile } from '../types';
import { getProfile, saveProfile, clearAuth } from '../lib/storage';

interface UserStore {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  loadProfile: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isAuthenticated: false,
  loading: true,

  loadProfile: async () => {
    try {
      const profile = await getProfile();
      set({ 
        profile, 
        isAuthenticated: !!profile, 
        loading: false 
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      set({ loading: false });
    }
  },

  updateProfile: async (profile: UserProfile) => {
    try {
      await saveProfile(profile);
      set({ profile, isAuthenticated: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  logout: async () => {
    await clearAuth();
    set({ profile: null, isAuthenticated: false });
  },
}));