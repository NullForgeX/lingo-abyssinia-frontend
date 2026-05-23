import type { UserRole } from '@/types';

// Frontend → backend onboarding rule:
// A learner is "onboarded" once their account preferences have a
// preferredLanguageId. This avoids adding a dedicated onboarded flag to
// the backend and keeps the source of truth on the server.
//
// The legacy localStorage key `lingo_onboarded` is honored as a fallback
// while the auth surface is still on mock data. Phase 1 of the integration
// plan removes it.

export type OnboardingInputs = {
  role: UserRole;
  preferredLanguageId: string | null | undefined;
};

export const needsOnboarding = ({ role, preferredLanguageId }: OnboardingInputs): boolean => {
  if (role !== 'learner') return false;
  return preferredLanguageId == null;
};

export const LEGACY_ONBOARDED_KEY = 'lingo_onboarded';

export const legacyOnboarded = (): boolean => {
  try {
    return localStorage.getItem(LEGACY_ONBOARDED_KEY) === 'true';
  } catch {
    return false;
  }
};
