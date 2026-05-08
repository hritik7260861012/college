import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  ranking: number | null;
  image: string | null;
  description: string | null;
  placementPercentage: number | null;
  avgPackage: number | null;
  establishedYear: number | null;
}

interface CompareStore {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isInCompare: (collegeId: string) => boolean;
  canAddToCompare: () => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareList: [],
      
      addToCompare: (college: College) => {
        const { compareList, canAddToCompare, isInCompare } = get();
        if (!canAddToCompare() || isInCompare(college.id)) return;
        set({ compareList: [...compareList, college] });
      },
      
      removeFromCompare: (collegeId: string) => {
        set({ compareList: get().compareList.filter(c => c.id !== collegeId) });
      },
      
      clearCompare: () => {
        set({ compareList: [] });
      },
      
      isInCompare: (collegeId: string) => {
        return get().compareList.some(c => c.id === collegeId);
      },
      
      canAddToCompare: () => {
        return get().compareList.length < 3;
      },
    }),
    {
      name: 'compare-storage',
    }
  )
);