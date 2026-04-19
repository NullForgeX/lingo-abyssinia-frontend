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
  amharic: "Amharic",
  oromo: "Afan Oromoo",
  tigrinya: "Tigrinya",
};

const translations: Record<UILanguage, Record<string, string>> = {
  english: {
    "app.learn": "Learn",
    "app.leaderboard": "Leaderboard",
    "app.profile": "Profile",
    "app.logout": "Log out",
    "app.backHome": "Back to home",
    "app.continue": "Continue",
    "app.tryAgain": "Try Again",

    "landing.title": "Discover the Beauty of Ethiopia's Languages",
    "landing.subtitle":
      "Master Amharic, Oromo, and Tigrinya through fun, bite-sized lessons designed to keep you engaged and motivated.",
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
    "dashboard.keepGoing":
      "Your learning path is in motion. Stay consistent today and keep your streak alive.",
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

    "notFound.title": "Oops! Page not found",
    "notFound.return": "Return to Home",
  },
  amharic: {
    "app.learn": "ትምህርት",
    "app.leaderboard": "የውድድር ሰንጠረዥ",
    "app.profile": "መገለጫ",
    "app.logout": "ውጣ",
    "app.backHome": "ወደ መነሻ ተመለስ",
    "app.continue": "ቀጥል",
    "app.tryAgain": "እንደገና ሞክር",

    "landing.title": "የኢትዮጵያ ቋንቋዎችን ውበት ያግኙ",
    "landing.subtitle": "አማርኛ፣ አፋን ኦሮሞ እና ትግርኛ በዘመናዊ እና አስደሳች ትምህርቶች ይማሩ።",
    "landing.ctaPrimary": "አሁን ጀምር - ነፃ",
    "landing.ctaSecondary": "አካውንት አለኝ",
    "landing.why": "ለምን Lingo Abyssinia",
    "landing.startPath": "በማንኛውም ቋንቋ ይጀምሩ",
    "landing.footer": "2026 Lingo Abyssinia.",

    "auth.loginTitle": "ግባ",
    "auth.loginSubtitle": "ትምህርትዎን ለመቀጠል መረጃዎን ያስገቡ።",
    "auth.signupTitle": "መለያ ፍጠር",
    "auth.signupSubtitle": "የኢትዮጵያ ቋንቋዎች ጉዞዎን ይጀምሩ።",
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
    "auth.signUpLink": "ተመዝገብ",
    "auth.logInLink": "ግባ",
    "auth.welcomeBack": "እንኳን ደህና መጡ!",
    "auth.startLearningToday": "ዛሬ መማር ይጀምሩ",

    "dashboard.welcome": "እንኳን ተመለሱ",
    "dashboard.momentum": "የቀን እድገት",
    "dashboard.keepGoing": "የትምህርትዎ ጉዞ በጥሩ ሁኔታ ቀጥሏል። ዛሬም ይቀጥሉ።",
    "dashboard.continueLearning": "መማርን ቀጥል",
    "dashboard.currentStreak": "ተከታታይ ቀናት",
    "dashboard.dailyGoal": "የቀን ግብ",
    "dashboard.gemsEarned": "የተገኙ Gems",
    "dashboard.lessonsDone": "የተጠናቀቁ ትምህርቶች",
    "dashboard.overallProgress": "አጠቃላይ እድገት",
    "dashboard.nextUp": "ቀጣይ",

    "profile.title": "መገለጫ",
    "profile.edit": "መገለጫ አርትዕ",
    "profile.save": "ለውጦችን አስቀምጥ",
    "profile.cancel": "ሰርዝ",
    "profile.language": "ቋንቋ",
    "profile.goal": "የቀን ግብ",
    "profile.minutes": "ደቂቃ",
    "profile.saved": "መገለጫው በተሳካ ሁኔታ ተዘምኗል።",

    "onboarding.chooseLanguage": "የትኛውን ቋንቋ መማር ይፈልጋሉ?",
    "onboarding.pickOne": "አንዱን ይምረጡ - በኋላ ተጨማሪ ማከል ይችላሉ።",
    "onboarding.setGoal": "የቀን ግብዎን ያስቀምጡ",
    "onboarding.commit": "በየቀኑ ስንት ጊዜ መመደብ ይችላሉ?",
    "onboarding.continue": "ቀጥል",
    "onboarding.back": "ተመለስ",
    "onboarding.startLearning": "መማር ጀምር",

    "leaderboard.title": "የውድድር ሰንጠረዥ",
    "leaderboard.subtitle": "ከሌሎች ተማሪዎች ጋር ይወዳደሩ።",
    "leaderboard.comingSoon": "በቅርቡ ይመጣል",

    "lesson.notFound": "ትምህርቱ አልተገኘም",
    "lesson.complete": "ትምህርቱ ተጠናቀቀ!",
    "lesson.keepPracticing": "ይለማመዱ!",
    "lesson.xpEarned": "የተገኘ XP",
    "lesson.accuracy": "ትክክለኛነት",
    "lesson.correct": "ትክክል",
    "lesson.of": "ከ",

    "notFound.title": "ይቅርታ! ገጹ አልተገኘም",
    "notFound.return": "ወደ መነሻ ተመለስ",
  },
  oromo: {
    "app.learn": "Baradhu",
    "app.leaderboard": "Gabatee Dorgommii",
    "app.profile": "Proofaayilii",
    "app.logout": "Ba'i",
    "app.backHome": "Gara manaatti deebi'i",
    "app.continue": "Itti fufi",
    "app.tryAgain": "Irra deebi'i yaali",

    "landing.title": "Qooqaalee Itoophiyaa bareedina isaanii argadhu",
    "landing.subtitle":
      "Amharic, Afan Oromoo fi Tigrinya barnoota gabaabaa fi gammachiisaa ta'een baradhu.",
    "landing.ctaPrimary": "Amma jalqabi - bilisa",
    "landing.ctaSecondary": "Ani account qaba",
    "landing.why": "Maaliif Lingo Abyssinia",
    "landing.startPath": "Qooqa kamiyyuu irraa jalqabi",
    "landing.footer": "2026 Lingo Abyssinia.",

    "auth.loginTitle": "Seeni",
    "auth.loginSubtitle": "Barnoota itti fufuuf odeeffannoo kee galchi.",
    "auth.signupTitle": "Account Uumi",
    "auth.signupSubtitle": "Imala barnoota qooqa Itoophiyaa jalqabi.",
    "auth.email": "Imeelii",
    "auth.password": "Jecha darbii",
    "auth.confirmPassword": "Jecha darbii mirkaneessi",
    "auth.fullName": "Maqaa guutuu",
    "auth.loginButton": "Seeni",
    "auth.loggingIn": "Seenaa jira...",
    "auth.signupButton": "Galmaa'i",
    "auth.creatingAccount": "Account uumamaa jira...",
    "auth.noAccount": "Account hin qabduu?",
    "auth.haveAccount": "Account qabdaa?",
    "auth.signUpLink": "Galmaa'i",
    "auth.logInLink": "Seeni",
    "auth.welcomeBack": "Baga nagaan dhuftan!",
    "auth.startLearningToday": "Har'a barachuu jalqabi",

    "dashboard.welcome": "Baga deebi'an",
    "dashboard.momentum": "Sochii Guyyaa",
    "dashboard.keepGoing":
      "Imalli barnoota kee itti fufaa jira. Har'a ciminaan itti fufi.",
    "dashboard.continueLearning": "Barnoota itti fufi",
    "dashboard.currentStreak": "Hordoffii Amma",
    "dashboard.dailyGoal": "Kaayyoo Guyyaa",
    "dashboard.gemsEarned": "Gems Argatan",
    "dashboard.lessonsDone": "Barnoota Xumurame",
    "dashboard.overallProgress": "Adeemsa Waliigalaa",
    "dashboard.nextUp": "Kan itti aanu",

    "profile.title": "Proofaayilii",
    "profile.edit": "Proofaayilii Gulaali",
    "profile.save": "Jijjiirama Olkaa'i",
    "profile.cancel": "Dhiisi",
    "profile.language": "Afaan",
    "profile.goal": "Kaayyoo Guyyaa",
    "profile.minutes": "daqiiqaa",
    "profile.saved": "Proofaayiliin milkaa'inaan haaromfame.",

    "onboarding.chooseLanguage": "Afaan kam barachuu barbaadda?",
    "onboarding.pickOne": "Tokko filadhu - booda dabaluu dandeessa.",
    "onboarding.setGoal": "Kaayyoo guyyaa kee kaa'i",
    "onboarding.commit": "Guyyaa guyyaan yeroo meeqa kennuu dandeessa?",
    "onboarding.continue": "Itti fufi",
    "onboarding.back": "Duubatti",
    "onboarding.startLearning": "Barachuu jalqabi",

    "leaderboard.title": "Gabatee Dorgommii",
    "leaderboard.subtitle": "Barattoota biraa waliin dorgomi.",
    "leaderboard.comingSoon": "Kutaa 2 keessatti dhufa",

    "lesson.notFound": "Barnoonni hin argamne",
    "lesson.complete": "Barnoonni xumurame!",
    "lesson.keepPracticing": "Itti fufi shaakali!",
    "lesson.xpEarned": "XP argame",
    "lesson.accuracy": "Sirrummaa",
    "lesson.correct": "Sirrii",
    "lesson.of": "kan",

    "notFound.title": "Oops! Fuulli kun hin argamne",
    "notFound.return": "Gara manaatti deebi'i",
  },
  tigrinya: {
    "app.learn": "ትምህርቲ",
    "app.leaderboard": "ደረጃ ውጽኢት",
    "app.profile": "መግለጺ ሓበሬታ",
    "app.logout": "ውጻእ",
    "app.backHome": "ናብ መበገሲ ተመለስ",
    "app.continue": "ቀጽል",
    "app.tryAgain": "እንደገና ፈትን",

    "landing.title": "ጽባቐ ቋንቋታት ኢትዮጵያ ርአ",
    "landing.subtitle": "ኣምሓርኛ፣ ኣፋን ኦሮሞን ትግርኛን ብሓጺርን ብምስትምሃር ተማሃር.",
    "landing.ctaPrimary": "ሕጂ ጀምር - ናጻ",
    "landing.ctaSecondary": "ኣነ መለለዪ ኣለኒ",
    "landing.why": "ስለምንታይ Lingo Abyssinia",
    "landing.startPath": "ብዝደለኻዮ ቋንቋ ጀምር",
    "landing.footer": "2026 Lingo Abyssinia.",

    "auth.loginTitle": "እቶ",
    "auth.loginSubtitle": "ትምህርትካ ክትቅጽል መረጃኻ ኣእቱ.",
    "auth.signupTitle": "መለለዪ ፍጠር",
    "auth.signupSubtitle": "ጉዕዞ ቋንቋታት ኢትዮጵያ ጀምር.",
    "auth.email": "ኢመይል",
    "auth.password": "ሚስጢር ቃል",
    "auth.confirmPassword": "ሚስጢር ቃል ኣረጋግጽ",
    "auth.fullName": "ሙሉእ ስም",
    "auth.loginButton": "እቶ",
    "auth.loggingIn": "እናኣተወ እዩ...",
    "auth.signupButton": "ተመዝገብ",
    "auth.creatingAccount": "መለለዪ እናተፈጥረ...",
    "auth.noAccount": "መለለዪ የብልካን?",
    "auth.haveAccount": "መለለዪ ኣለካ?",
    "auth.signUpLink": "ተመዝገብ",
    "auth.logInLink": "እቶ",
    "auth.welcomeBack": "እንቋዕ ብደሓን መጻእኩም!",
    "auth.startLearningToday": "ሎሚ ምምሃር ጀምር",

    "dashboard.welcome": "እንቋዕ ተመለስካ",
    "dashboard.momentum": "ዕለታዊ ምምሕዳር",
    "dashboard.keepGoing": "መንገዲ ትምህርትካ ይቕጽል ኣሎ። ሎሚ ኣጽንዕ.",
    "dashboard.continueLearning": "ትምህርት ቀጽል",
    "dashboard.currentStreak": "ናይ ሕጂ ተኸታታሊ",
    "dashboard.dailyGoal": "ዕለታዊ ዕላማ",
    "dashboard.gemsEarned": "ዝተረኽቡ Gems",
    "dashboard.lessonsDone": "ዝተዛዘሙ ትምህርታት",
    "dashboard.overallProgress": "ሓፈሻዊ ምዕባለ",
    "dashboard.nextUp": "ቀጺሉ",

    "profile.title": "መግለጺ ሓበሬታ",
    "profile.edit": "መግለጺ ሓበሬታ ኣርም",
    "profile.save": "ለውጢ ኣቐምጥ",
    "profile.cancel": "ሰርዝ",
    "profile.language": "ቋንቋ",
    "profile.goal": "ዕለታዊ ዕላማ",
    "profile.minutes": "ደቒቕ",
    "profile.saved": "መግለጺ ሓበሬታ ብትኽክል ተሓዲሱ።",

    "onboarding.chooseLanguage": "ኣየናይ ቋንቋ ክትምሃር ትደሊ?",
    "onboarding.pickOne": "ክትጅምር ሓደ ምረጽ - ድሕሪ እዚ ተወሳኺ ክትገብር ትኽእል.",
    "onboarding.setGoal": "ዕለታዊ ዕላማኻ ኣቐምጥ",
    "onboarding.commit": "መዓልታዊ ክንደይ ግዜ ክትውፍይ ትኽእል?",
    "onboarding.continue": "ቀጽል",
    "onboarding.back": "ድሕሪት",
    "onboarding.startLearning": "ምምሃር ጀምር",

    "leaderboard.title": "ደረጃ ውጽኢት",
    "leaderboard.subtitle": "ምስ ካልኦት ተማሃሮ ተወዳደር.",
    "leaderboard.comingSoon": "ኣብ ደረጃ 2 ይመጽእ",

    "lesson.notFound": "ትምህርቲ ኣይተረኽበን",
    "lesson.complete": "ትምህርቲ ተዛዚሙ!",
    "lesson.keepPracticing": "ኣብ ልምዲ ቀጽል!",
    "lesson.xpEarned": "XP ዝተረኽበ",
    "lesson.accuracy": "ትኽክለኛነት",
    "lesson.correct": "ትኽክል",
    "lesson.of": "ካብ",

    "notFound.title": "Oops! ገጽ ኣይተረኽበን",
    "notFound.return": "ናብ መበገሲ ተመለስ",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [uiLanguage, setUiLanguageState] = useState<UILanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UILanguage | null;
    if (saved && ["english", "amharic", "oromo", "tigrinya"].includes(saved)) {
      return saved;
    }
    return "english";
  });

  const setUiLanguage = (lang: UILanguage) => {
    setUiLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string) => {
    return translations[uiLanguage][key] ?? translations.english[key] ?? key;
  };

  const value = useMemo(
    () => ({
      uiLanguage,
      setUiLanguage,
      t,
      languageLabel: (lang: UILanguage) => languageLabels[lang],
    }),
    [uiLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
};
