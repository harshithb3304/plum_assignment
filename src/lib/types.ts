export interface UserProfile {
  age: number;
  gender: string;
  goals: string[];
  customGoals?: string[]; // For "Others" input
}

export interface WellnessTip {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  category: string;
  longExplanation?: string;
  steps?: string[];
}

export type Screen = 'profile' | 'tips' | 'detail' | 'favorites';

export const WELLNESS_GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Better Sleep',
  'Stress Reduction',
  'Increased Energy',
  'Better Nutrition',
  'Mental Clarity',
  'Flexibility',
  'Cardiovascular Health',
  'Work-Life Balance',
  'Others' // Special option for custom input
] as const;

export const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say'] as const;

export const CATEGORY_COLORS = {
  nutrition: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  exercise: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'mental-health': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  sleep: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  lifestyle: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
} as const;