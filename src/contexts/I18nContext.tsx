import React, { createContext, useContext, useMemo, useState } from "react";

export type UILanguage = "english" | "amharic" | "oromo" | "tigrinya";

type I18nContextType = {
  uiLanguage: UILanguage;
  setUiLanguage: (lang: UILanguage) => void;
  t: (key: string) => string;
  languageLabel: (lang: UILanguage) => string;
};

const STORAGE_KEY = "lingo_ui_language";

const languageLabels: Record<UILanguage, string> = {
  english: "English",
  amharic: "አማርኛ",
  oromo: "Afan Oromoo",
  tigrinya: "ትግርኛ",
};

const english = {
  "app.learn": "Practice",
  "app.leaderboard": "Leaderboard",
  "app.profile": "Profile",
  "app.logout": "Log out",
  "app.backHome": "Back to home",
  "app.continue": "Continue",
  "app.tryAgain": "Try Again",
  "app.home": "Home",
  "app.community": "Community",

  "landing.title": "Discover the Beauty of Ethiopia's Languages",
  "landing.subtitle": "Master Amharic, Afan Oromoo, and Tigrinya through fun, bite-sized lessons designed to keep you engaged and motivated.",
  "landing.ctaPrimary": "Get Started - It's Free",
  "landing.ctaSecondary": "I already have an account",
  "landing.why": "Why Lingo Abyssinia",
  "landing.startPath": "Start with any language",
  "landing.footer": "2026 Lingo Abyssinia.",

  "auth.loginTitle": "Log In",
  "auth.loginSubtitle": "Enter your credentials to continue learning.",
  "auth.signupTitle": "Create Account",
  "auth.signupSubtitle": "Begin your journey into Ethiopian languages.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm Password",
  "auth.fullName": "Full Name",
  "auth.loginButton": "Log In",
  "auth.loggingIn": "Logging in...",
  "auth.signupButton": "Sign Up",
  "auth.creatingAccount": "Creating account...",
  "auth.noAccount": "Don't have an account?",
  "auth.haveAccount": "Already have an account?",
  "auth.signUpLink": "Sign up",
  "auth.logInLink": "Log in",
  "auth.welcomeBack": "Welcome Back!",
  "auth.startLearningToday": "Start Learning Today",

  "dashboard.welcome": "Welcome back",
  "dashboard.momentum": "Daily Momentum",
  "dashboard.keepGoing": "Your learning path is in motion. Stay consistent today and keep your streak alive.",
  "dashboard.continueLearning": "Continue learning",
  "dashboard.currentStreak": "Current Streak",
  "dashboard.dailyGoal": "Daily Goal",
  "dashboard.gemsEarned": "Gems Earned",
  "dashboard.lessonsDone": "Lessons Done",
  "dashboard.overallProgress": "Overall Progress",
  "dashboard.nextUp": "Next Up",

  "profile.title": "Profile",
  "profile.edit": "Edit Profile",
  "profile.save": "Save Changes",
  "profile.cancel": "Cancel",
  "profile.language": "Language",
  "profile.goal": "Daily Goal",
  "profile.minutes": "minutes",
  "profile.saved": "Profile updated successfully.",

  "onboarding.chooseLanguage": "Which language do you want to learn?",
  "onboarding.pickOne": "Pick one to start - you can always add more later.",
  "onboarding.setGoal": "Set your daily goal",
  "onboarding.commit": "How much time can you commit each day?",
  "onboarding.continue": "Continue",
  "onboarding.back": "Back",
  "onboarding.startLearning": "Start Learning",

  "leaderboard.title": "Leaderboard",
  "leaderboard.subtitle": "Compete with other learners.",
  "leaderboard.comingSoon": "Coming in Phase 2",

  "lesson.notFound": "Lesson not found",
  "lesson.complete": "Lesson Complete!",
  "lesson.keepPracticing": "Keep Practicing!",
  "lesson.xpEarned": "XP Earned",
  "lesson.accuracy": "Accuracy",
  "lesson.correct": "Correct",
  "lesson.of": "of",

  "learn.clearPath": "Clear path through every lesson.",
  "learn.startNext": "Start next lesson",
  "learn.review": "Review",
  "learn.start": "Start",
  "learn.locked": "Locked",
  "learn.courseCompleted": "Course completed",
  "learn.changeLanguage": "Change language",
  "learn.backHome": "Back home",

  "home.quickAccess": "Quick access",
  "home.goToLearn": "Go to Learn",
  "home.open": "Open",
  "home.languageSelection": "Language selection",
  "home.languageSelectionDesc": "Change your learning language any time.",
  "home.generalInfo": "General info",
  "home.streakHistory": "Streak history",
  "home.streakHistoryDesc": "Track your daily practice streak.",
  "home.badgeHistory": "Badge history",
  "home.badgeHistoryDesc": "Review badges you have earned.",
  "home.skillChart": "Skill chart",
  "home.skillChartDesc": "See your growth across lessons.",

  "notFound.title": "Oops! Page not found",
  "notFound.return": "Return to Home",
};

const translations: Record<UILanguage, Record<string, string>> = {
  english,
  amharic: {
    ...english,
    "app.learn": "ተለማመድ",
    "app.leaderboard": "የውጤት ሰሌዳ",
    "app.profile": "መገለጫ",
    "app.logout": "ውጣ",
    "app.backHome": "ወደ መነሻ ተመለስ",
    "app.continue": "ቀጥል",
    "app.tryAgain": "እንደገና ሞክር",
    "app.home": "መነሻ",
    "app.community": "ማህበረሰብ",
    "landing.title": "የኢትዮጵያን ቋንቋዎች ውበት ያግኙ",
    "landing.subtitle": "አማርኛ፣ Afan Oromoo እና ትግርኛን በአጫጭርና አስደሳች ትምህርቶች ይማሩ።",
    "landing.ctaPrimary": "ጀምር - ነፃ ነው",
    "landing.ctaSecondary": "መለያ አለኝ",
    "landing.why": "ለምን Lingo Abyssinia",
    "landing.startPath": "በማንኛውም ቋንቋ ይጀምሩ",
    "auth.loginTitle": "ግባ",
    "auth.loginSubtitle": "መማርን ለመቀጠል መረጃዎን ያስገቡ።",
    "auth.signupTitle": "መለያ ፍጠር",
    "auth.signupSubtitle": "ወደ ኢትዮጵያ ቋንቋዎች ጉዞዎን ይጀምሩ።",
    "auth.email": "ኢሜይል",
    "auth.password": "የይለፍ ቃል",
    "auth.confirmPassword": "የይለፍ ቃል አረጋግጥ",
    "auth.fullName": "ሙሉ ስም",
    "auth.loginButton": "ግባ",
    "auth.loggingIn": "በመግባት ላይ...",
    "auth.signupButton": "ተመዝገብ",
    "auth.creatingAccount": "መለያ በመፍጠር ላይ...",
    "auth.noAccount": "መለያ የለዎትም?",
    "auth.haveAccount": "መለያ አለዎት?",
    "auth.signUpLink": "ይመዝገቡ",
    "auth.logInLink": "ይግቡ",
    "auth.welcomeBack": "እንኳን ደህና መጡ!",
    "auth.startLearningToday": "ዛሬ መማር ይጀምሩ",
    "dashboard.welcome": "እንኳን ተመለሱ",
    "dashboard.overallProgress": "አጠቃላይ እድገት",
    "onboarding.chooseLanguage": "የትኛውን ቋንቋ መማር ይፈልጋሉ?",
    "onboarding.pickOne": "ለመጀመር አንዱን ይምረጡ።",
    "onboarding.setGoal": "የቀን ግብዎን ያዘጋጁ",
    "onboarding.continue": "ቀጥል",
    "onboarding.back": "ተመለስ",
    "onboarding.startLearning": "መማር ጀምር",
    "lesson.complete": "ትምህርቱ ተጠናቋል!",
    "lesson.keepPracticing": "መለማመድ ይቀጥሉ!",
    "learn.startNext": "ቀጣዩን ትምህርት ጀምር",
    "learn.review": "ይከልሱ",
    "learn.start": "ጀምር",
    "learn.locked": "ተቆልፏል",
    "learn.changeLanguage": "ቋንቋ ቀይር",
    "learn.backHome": "ወደ መነሻ",
  },
  oromo: {
    ...english,
    "app.learn": "Beeji",
    "app.leaderboard": "Gabatee qabxii",
    "app.profile": "Profaayilii",
    "app.logout": "Ba'i",
    "app.backHome": "Gara jalqabaa deebi'i",
    "app.continue": "Itti fufi",
    "app.tryAgain": "Ammas yaali",
    "app.home": "Jalqaba",
    "app.community": "Hawaasa",
    "landing.title": "Bareedina Afaanota Itoophiyaa argadhu",
    "landing.subtitle": "Afaan Amaaraa, Afan Oromoo fi Tigrinya barnoota gabaabaa fi gammachiisaa ta'een baradhu.",
    "auth.loginTitle": "Seeni",
    "auth.signupTitle": "Herrega uumi",
    "auth.email": "Imeelii",
    "auth.password": "Jecha darbii",
    "auth.confirmPassword": "Jecha darbii mirkaneessi",
    "auth.fullName": "Maqaa guutuu",
    "auth.loginButton": "Seeni",
    "auth.signupButton": "Galmaa'i",
    "auth.welcomeBack": "Baga nagaan deebite!",
    "auth.startLearningToday": "Har'a barachuu jalqabi",
    "onboarding.chooseLanguage": "Afaan kam barachuu barbaadda?",
    "onboarding.continue": "Itti fufi",
    "onboarding.back": "Duuba",
    "onboarding.startLearning": "Barachuu jalqabi",
    "learn.start": "Jalqabi",
    "learn.locked": "Cufame",
    "learn.review": "Irra deebi'i",
  },
  tigrinya: {
    ...english,
    "app.learn": "ተለማድ",
    "app.leaderboard": "ሰሌዳ ውጽኢት",
    "app.profile": "መግለጺ",
    "app.logout": "ውጻእ",
    "app.backHome": "ናብ መጀመርታ ተመለስ",
    "app.continue": "ቀጽል",
    "app.tryAgain": "እንደገና ፈትን",
    "app.home": "መጀመርታ",
    "app.community": "ማሕበረሰብ",
    "landing.title": "ጽባቐ ቋንቋታት ኢትዮጵያ ርኸብ",
    "landing.subtitle": "ኣምሓርኛ፣ Afan Oromoo እና ትግርኛ ብሓጸርቲን ዘሐጉሱን ትምህርትታት ተማሃር።",
    "landing.ctaPrimary": "ጀምር - ነጻ እዩ",
    "landing.ctaSecondary": "መለያ ኣለኒ",
    "auth.loginTitle": "እቶ",
    "auth.loginSubtitle": "ትምህርትኻ ንምቕጻል መረዳእታኻ ኣእቱ።",
    "auth.signupTitle": "መለያ ፍጠር",
    "auth.signupSubtitle": "ጉዕዞኻ ናብ ቋንቋታት ኢትዮጵያ ጀምር።",
    "auth.email": "ኢመይል",
    "auth.password": "ምስጢር ቃል",
    "auth.confirmPassword": "ምስጢር ቃል ኣረጋግጽ",
    "auth.fullName": "ሙሉእ ስም",
    "auth.loginButton": "እቶ",
    "auth.loggingIn": "ይኣቱ ኣሎ...",
    "auth.signupButton": "ተመዝገብ",
    "auth.creatingAccount": "መለያ ይፈጥር ኣሎ...",
    "auth.noAccount": "መለያ የብልካን?",
    "auth.haveAccount": "መለያ ኣለካ?",
    "auth.signUpLink": "ተመዝገብ",
    "auth.logInLink": "እቶ",
    "auth.welcomeBack": "እንኳዕ ብደሓን ተመለስካ!",
    "auth.startLearningToday": "ሎሚ ትምህርቲ ጀምር",
    "dashboard.welcome": "እንኳዕ ተመለስካ",
    "dashboard.overallProgress": "ሓፈሻዊ ዕቤት",
    "onboarding.chooseLanguage": "ኣየናይ ቋንቋ ክትመሃር ትደሊ?",
    "onboarding.pickOne": "ንምጅማር ሓደ ምረጽ።",
    "onboarding.setGoal": "ዕላማ መዓልታዊ ኣቐምጥ",
    "onboarding.continue": "ቀጽል",
    "onboarding.back": "ተመለስ",
    "onboarding.startLearning": "ትምህርቲ ጀምር",
    "lesson.complete": "ትምህርቲ ተዛዚሙ!",
    "lesson.keepPracticing": "ምልምማድ ቀጽል!",
    "learn.startNext": "ቀጻሊ ትምህርቲ ጀምር",
    "learn.review": "ክለሳ",
    "learn.start": "ጀምር",
    "learn.locked": "ተዓጽዩ",
    "learn.changeLanguage": "ቋንቋ ቀይር",
    "learn.backHome": "ናብ መጀመርታ",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiLanguage, setUiLanguageState] = useState<UILanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UILanguage | null;
    if (saved && ["english", "amharic", "oromo", "tigrinya"].includes(saved)) return saved;
    return "english";
  });

  const setUiLanguage = (lang: UILanguage) => {
    setUiLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string) => translations[uiLanguage][key] ?? english[key as keyof typeof english] ?? key;

  const value = useMemo(
    () => ({ uiLanguage, setUiLanguage, t, languageLabel: (lang: UILanguage) => languageLabels[lang] }),
    [uiLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};