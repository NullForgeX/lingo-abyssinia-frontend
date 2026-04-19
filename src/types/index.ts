export interface User {
  id: string;
  name: string;
  email: string;
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
