export const userRoles = ['learner', 'content_manager', 'system_admin'] as const;
export type UserRole = (typeof userRoles)[number];

export const staffRoles = ['content_manager', 'system_admin'] as const;
export type StaffRole = (typeof staffRoles)[number];

export const isStaffRole = (role: UserRole): role is StaffRole =>
  role === 'content_manager' || role === 'system_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  selectedLanguage: 'amharic' | 'oromo' | 'tigrinya';
  dailyGoal: number;
  streak: number;
  gems: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface UserPreferences {
  language: 'amharic' | 'oromo' | 'tigrinya';
  dailyGoal: number;
}
