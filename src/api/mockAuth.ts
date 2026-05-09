import { User } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (email: string, _password: string): Promise<{ user: User; token: string }> => {
  await delay(1000);
  const isAdmin = email.toLowerCase().includes("admin");
  return {
    user: {
      id: 'user-1',
      name: email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : 'learner',
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
      role: 'learner',
      selectedLanguage: 'amharic',
      dailyGoal: 15,
      streak: 0,
      gems: 0,
    },
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const mockRequestPasswordReset = async (_email: string): Promise<{ message: string }> => {
  await delay(900);
  return { message: "If an account exists with this email, a reset link has been sent." };
};

export const mockResetPassword = async (_token: string, _newPassword: string): Promise<{ success: boolean }> => {
  await delay(1000);
  return { success: true };
};
