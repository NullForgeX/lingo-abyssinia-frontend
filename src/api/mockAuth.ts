import { User } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (email: string, _password: string): Promise<{ user: User; token: string }> => {
  await delay(1000);
  return {
    user: {
      id: 'user-1',
      name: email.split('@')[0],
      email,
      selectedLanguage: 'amharic',
      dailyGoal: 15,
      streak: 0,
      gems: 0,
    },
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const mockSignup = async (name: string, email: string, _password: string): Promise<{ user: User; token: string }> => {
  await delay(1000);
  return {
    user: {
      id: 'user-' + Date.now(),
      name,
      email,
      selectedLanguage: 'amharic',
      dailyGoal: 15,
      streak: 0,
      gems: 0,
    },
    token: 'mock-jwt-token-' + Date.now(),
  };
};
