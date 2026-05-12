import { useState, useEffect, useCallback } from 'react';

export type FragmentType = 'thought' | 'quote' | 'photo' | 'voice' | 'film' | 'song';

export interface Fragment {
  id: string;
  type: FragmentType;
  content: string;
  category: string;
  metadata?: {
    filmTitle?: string;
    songTitle?: string;
    songArtist?: string;
    audioBase64?: string;
    imageBase64?: string;
  };
  dayId: string;             // YYYY-MM-DD
  createdAt: string;          // ISO
}

export interface Day {
  id: string;                 // YYYY-MM-DD
  intention?: string;
  intentionSetAt?: string;
  savedAt?: string;            // set when user presses "save the day"
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Preferences {
  dayStartHour: number;       // default 6
  sundayReviewHour: number;   // default 17
  showMorningPrompt: boolean; // default true
  aiAutoCategorize: boolean;  // default false
  aiWeeklyNoticing: boolean;  // default false
}

export interface LoomData {
  fragments: Fragment[];
  days: Day[];
  categories: Category[];
  preferences: Preferences;
}

const STORAGE_KEY = 'loom_personal_v1';

const defaultCategories: Category[] = [
  { id: 'cat-all', name: 'All Thoughts', order: 0 },
  { id: 'cat-phil', name: 'Philosophy', order: 1 },
  { id: 'cat-eng', name: 'Engineering', order: 2 },
  { id: 'cat-crea', name: 'Creative', order: 3 },
  { id: 'cat-log', name: 'Personal Log', order: 4 },
];

const defaultPreferences: Preferences = {
  dayStartHour: 6,
  sundayReviewHour: 17,
  showMorningPrompt: true,
  aiAutoCategorize: false,
  aiWeeklyNoticing: false,
};

const initialData: LoomData = {
  fragments: [],
  days: [],
  categories: defaultCategories,
  preferences: defaultPreferences,
};

export function useLoomStore() {
  const [data, setData] = useState<LoomData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse Loom data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveData = useCallback((newData: LoomData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const addFragment = useCallback((fragment: Omit<Fragment, 'id' | 'createdAt' | 'dayId'>) => {
    const now = new Date();
    const dayId = now.toISOString().split('T')[0];
    const newFragment: Fragment = {
      ...fragment,
      id: crypto.randomUUID(),
      createdAt: now.toISOString(),
      dayId: dayId,
    };
    
    saveData({
      ...data,
      fragments: [newFragment, ...data.fragments],
    });
  }, [data, saveData]);

  const updateFragment = useCallback((id: string, updates: Partial<Fragment>) => {
    saveData({
      ...data,
      fragments: data.fragments.map(f => f.id === id ? { ...f, ...updates } : f),
    });
  }, [data, saveData]);

  const deleteFragment = useCallback((id: string) => {
    saveData({
      ...data,
      fragments: data.fragments.filter(f => f.id !== id),
    });
  }, [data, saveData]);

  const setIntention = useCallback((intention: string) => {
    const now = new Date();
    const dayId = now.toISOString().split('T')[0];
    const existingDay = data.days.find(d => d.id === dayId);
    
    let newDays;
    if (existingDay) {
      newDays = data.days.map(d => d.id === dayId ? { ...d, intention, intentionSetAt: now.toISOString() } : d);
    } else {
      newDays = [{ id: dayId, intention, intentionSetAt: now.toISOString() }, ...data.days];
    }
    
    saveData({
      ...data,
      days: newDays,
    });
  }, [data, saveData]);

  const saveTheDay = useCallback(() => {
    const now = new Date();
    const dayId = now.toISOString().split('T')[0];
    const existingDay = data.days.find(d => d.id === dayId);
    
    let newDays;
    if (existingDay) {
      newDays = data.days.map(d => d.id === dayId ? { ...d, savedAt: now.toISOString() } : d);
    } else {
      newDays = [{ id: dayId, savedAt: now.toISOString() }, ...data.days];
    }
    
    saveData({
      ...data,
      days: newDays,
    });
  }, [data, saveData]);

  const resetSaveTheDay = useCallback(() => {
    saveData({
      ...data,
      days: data.days.map(d => ({ ...d, savedAt: undefined })),
    });
  }, [data, saveData]);

  const updatePreferences = useCallback((updates: Partial<Preferences>) => {
    saveData({
      ...data,
      preferences: { ...data.preferences, ...updates },
    });
  }, [data, saveData]);

  const addCategory = useCallback((name: string) => {
    const newCategory: Category = {
      id: `cat-${crypto.randomUUID()}`,
      name,
      order: data.categories.length,
    };
    saveData({
      ...data,
      categories: [...data.categories, newCategory],
    });
  }, [data, saveData]);

  const clearAllData = useCallback(() => {
    saveData(initialData);
  }, [saveData]);

  const getTodayState = useCallback((): 'morning' | 'daytime' | 'review' => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const dayId = now.toISOString().split('T')[0];
    const todayData = data.days.find(d => d.id === dayId);
    
    const intentionSetToday = !!todayData?.intention;
    const userTriggeredReview = !!todayData?.savedAt;

    if ((dayOfWeek === 0 && hour >= data.preferences.sundayReviewHour) || userTriggeredReview) {
      return 'review';
    }

    if (hour < 12 && !intentionSetToday && data.preferences.showMorningPrompt) {
      return 'morning';
    }

    return 'daytime';
  }, [data]);

  return {
    data,
    isLoaded,
    addFragment,
    updateFragment,
    deleteFragment,
    setIntention,
    saveTheDay,
    resetSaveTheDay,
    updatePreferences,
    addCategory,
    clearAllData,
    getTodayState,
  };
}
