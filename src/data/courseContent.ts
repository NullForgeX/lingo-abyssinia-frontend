export interface Exercise {
  id: string;
  type: "multiple-choice" | "translation" | "audio";
  question: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  image?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  language: "amharic" | "oromo" | "tigrinya";
  units: Unit[];
}

type Lang = Course["language"];

type TopicCard = {
  english: string;
  target: string;
  category: string;
};

type Lexicon = {
  greeting: string;
  thanks: string;
  goodbye: string;
  yes: string;
  no: string;
  numbers: string[];
  people: string[];
  places: string[];
  foods: string[];
  verbs: string[];
};

const lexicons: Record<Lang, Lexicon> = {
  amharic: {
    greeting: "selam",
    thanks: "ameseginalehu",
    goodbye: "dehna hun",
    yes: "awo",
    no: "aydellem",
    numbers: ["and", "hulet", "sost", "arat", "amist", "sidist", "sebat", "siment", "zetegn", "asir"],
    people: ["enat", "abat", "wendim", "ehet", "memhir", "temari"],
    places: ["bet", "suq", "timhirt bet", "addis", "mender"],
    foods: ["injera", "shiro", "buna", "dabo", "wot"],
    verbs: ["hed", "metta", "bel", "teyik", "moker"],
  },
  oromo: {
    greeting: "nagaa",
    thanks: "galatoomaa",
    goodbye: "nagaatti",
    yes: "eeyyee",
    no: "lakki",
    numbers: ["tokko", "lama", "sadii", "afur", "shan", "jaha", "torba", "saddeet", "sagal", "kudhan"],
    people: ["haadha", "abba", "obboleessa", "obboleettii", "barsiisaa", "barataa"],
    places: ["mana", "gabaa", "mana barumsaa", "magaalaa", "baadiyyaa"],
    foods: ["buddeena", "ittoo", "buna", "daabboo", "foon"],
    verbs: ["deemi", "kottu", "nyaadhu", "gaafadhu", "shaakali"],
  },
  tigrinya: {
    greeting: "selam",
    thanks: "yekenyeley",
    goodbye: "dehan kun",
    yes: "ee",
    no: "aykonen",
    numbers: ["hade", "kilte", "seleste", "arbaete", "hamushte", "shudushte", "shewate", "shimente", "tishate", "aserte"],
    people: ["ade", "ab", "haw", "hafti", "memhir", "temhari"],
    places: ["geza", "suuq", "bet timhrti", "asmera", "qushet"],
    foods: ["injera", "shiro", "buna", "himbasha", "tsahli"],
    verbs: ["deyeb", "nsi", "bela", "hato", "moker"],
  },
};

const unitBlueprints: Array<{ title: string; description: string; lessonTitles: string[] }> = [
  { title: "Foundations", description: "Characters, greetings, polite phrases, and survival basics.", lessonTitles: ["Learn Characters", "Greetings", "Polite Words", "Introducing Yourself", "Mini Conversation"] },
  { title: "Numbers and Time", description: "Learn numbers, days, months, and daily schedules.", lessonTitles: ["Learn Numbers", "Days of the Week", "Months of the Year", "Telling Time", "Daily Schedule"] },
  { title: "People and Family", description: "Talk about family, friends, and roles.", lessonTitles: ["Family Members", "Describing People", "Professions", "Age and Birthday", "Social Introductions"] },
  { title: "Home and Places", description: "Navigate places and ask for directions.", lessonTitles: ["Learn Directions", "Asking Directions", "Neighborhood", "At School", "City vs Village"] },
  { title: "Food and Market", description: "Order food and shop with confidence.", lessonTitles: ["Common Foods", "At the Market", "Ordering Meals", "Quantities and Prices", "Food Preferences"] },
  { title: "Actions and Verbs", description: "Core verbs and sentence building.", lessonTitles: ["Common Verbs", "Present Actions", "Past Actions", "Future Plans", "Mixed Practice"] },
  { title: "Travel and Transport", description: "Move around and ask travel questions.", lessonTitles: ["Transportation Words", "Buying Tickets", "Asking Routes", "At the Station", "Trip Dialogues"] },
  { title: "Health and Wellbeing", description: "Explain basic health needs and feelings.", lessonTitles: ["Body and Feelings", "At the Clinic", "Describing Symptoms", "Advice and Help", "Health Check Dialogue"] },
  { title: "Work and Study", description: "Use language in school and workplace contexts.", lessonTitles: ["Classroom Language", "Office Expressions", "Tasks and Deadlines", "Meetings and Notes", "Formal Conversation"] },
  { title: "Culture and Community", description: "Learn language tied to culture and social life.", lessonTitles: ["Holidays", "Community Events", "Traditions", "Music and Stories", "Cultural Dialogue"] },
  { title: "Intermediate Fluency", description: "Longer comprehension and response drills.", lessonTitles: ["Listening Practice", "Reading Short Texts", "Responding Naturally", "Error Correction", "Fluency Challenge"] },
  { title: "Mastery Path", description: "Advanced mixed practice and review.", lessonTitles: ["Advanced Vocabulary", "Complex Sentences", "Scenario Simulation", "Fast Review", "Final Mastery Test"] },
];

const topicEnglish: Record<string, string[]> = {
  Foundations: ["character", "hello", "thank you", "my name is", "goodbye"],
  "Numbers and Time": ["one", "Monday", "January", "time", "morning"],
  "People and Family": ["mother", "father", "brother", "sister", "teacher"],
  "Home and Places": ["home", "where is it?", "near", "school", "city"],
  "Food and Market": ["injera", "stew", "coffee", "bread", "meat"],
  "Actions and Verbs": ["go", "come", "eat", "ask", "practice"],
  "Travel and Transport": ["bus", "ticket", "road", "station", "trip"],
  "Health and Wellbeing": ["head", "doctor", "pain", "help", "rest"],
  "Work and Study": ["book", "office", "task", "meeting", "note"],
  "Culture and Community": ["holiday", "community", "tradition", "song", "story"],
  "Intermediate Fluency": ["listen", "read", "reply", "correct", "speak"],
  "Mastery Path": ["advanced", "sentence", "scenario", "review", "mastery"],
};

const topicTargets: Record<Lang, Record<string, string[]>> = {
  amharic: {
    Foundations: ["fidäl", "selam", "ameseginalehu", "sime ... new", "dehna hun"],
    "Numbers and Time": ["and", "segno", "meskerem", "seat", "tuwat"],
    "People and Family": ["enat", "abat", "wendim", "ehet", "memhir"],
    "Home and Places": ["bet", "yet new?", "tekarab", "timhirt bet", "ketema"],
    "Food and Market": ["injera", "shiro", "buna", "dabo", "wot"],
    "Actions and Verbs": ["hed", "metta", "bel", "teyik", "moker"],
    "Travel and Transport": ["awtobus", "tiketi", "menged", "maferia", "guzo"],
    "Health and Wellbeing": ["ras", "hakim", "himem", "erdagn", "arif"],
    "Work and Study": ["metsaf", "biro", "sira", "sibseba", "mastawesha"],
    "Culture and Community": ["baal", "mahbereseb", "bahil", "zefen", "teret"],
    "Intermediate Fluency": ["adamet", "anbeb", "melis", "astekakel", "tenager"],
    "Mastery Path": ["keftegna", "sentence", "gidaj", "review", "mastery"],
  },
  oromo: {
    Foundations: ["qubee", "akkam", "galatoomaa", "maqaan koo ...", "nagaatti"],
    "Numbers and Time": ["tokko", "wiixata", "amajjii", "sa'aatii", "ganama"],
    "People and Family": ["haadha", "abba", "obboleessa", "obboleettii", "barsiisaa"],
    "Home and Places": ["mana", "eessa jira?", "dhihoo", "mana barumsaa", "magaalaa"],
    "Food and Market": ["buddeena", "ittoo", "buna", "daabboo", "foon"],
    "Actions and Verbs": ["deemi", "kottu", "nyaadhu", "gaafadhu", "shaakali"],
    "Travel and Transport": ["atoobisii", "tikeetii", "karaa", "buufata", "imala"],
    "Health and Wellbeing": ["mataa", "doktora", "dhukkuba", "gargaarsa", "boqonnaa"],
    "Work and Study": ["kitaaba", "waajjira", "hojii", "walgahii", "yaadannoo"],
    "Culture and Community": ["ayyaana", "hawaasa", "aadaa", "sirba", "seenaa"],
    "Intermediate Fluency": ["dhaggeeffadhu", "dubbisi", "deebisi", "sirreessi", "dubbadhu"],
    "Mastery Path": ["ol aanaa", "hima", "haala", "irra deebi", "gooftummaa"],
  },
  tigrinya: {
    Foundations: ["fidäl", "selam", "yekenyeley", "shimay ... iyu", "dehan kun"],
    "Numbers and Time": ["hade", "segno", "january", "sa'at", "nigho"],
    "People and Family": ["ade", "ab", "haw", "hafti", "memhir"],
    "Home and Places": ["geza", "abey alo?", "qeribu", "bet timhrti", "ketema"],
    "Food and Market": ["injera", "shiro", "buna", "himbasha", "tsahli"],
    "Actions and Verbs": ["deyeb", "nsi", "bela", "hato", "moker"],
    "Travel and Transport": ["awtobus", "ticket", "mengedi", "station", "guzo"],
    "Health and Wellbeing": ["reesi", "doktor", "himam", "hገዝ", "arif"],
    "Work and Study": ["metsihaf", "biro", "sira", "meeting", "not"],
    "Culture and Community": ["baal", "hizbi", "bahli", "zefen", "tarik"],
    "Intermediate Fluency": ["semae", "anbebe", "melisi", "astakakil", "tezareb"],
    "Mastery Path": ["advanced", "sentence", "scenario", "review", "mastery"],
  },
};

const languageNames: Record<Lang, string> = {
  amharic: "Amharic",
  oromo: "Afan Oromoo",
  tigrinya: "Tigrinya",
};

function pick<T>(arr: T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

function shuffleOptions<T>(arr: T[], seed: number): T[] {
  return [...arr].sort((a, b) => {
    const aScore = JSON.stringify(a).length * 17 + seed * 13 + String(a).charCodeAt(0);
    const bScore = JSON.stringify(b).length * 17 + seed * 13 + String(b).charCodeAt(0);
    return (aScore % 11) - (bScore % 11);
  });
}

function getTopicCard(language: Lang, unitTitle: string, lessonIndex: number): TopicCard {
  const english = topicEnglish[unitTitle][lessonIndex];
  const target = topicTargets[language][unitTitle][lessonIndex];
  return { english, target, category: unitTitle };
}

function makeExercises(language: Lang, unitTitle: string, lessonId: string, _lessonTitle: string, lessonIndex: number, seed: number): Exercise[] {
  const lx = lexicons[language];
  const langName = languageNames[language];
  const card = getTopicCard(language, unitTitle, lessonIndex);
  const support = getTopicCard(language, unitTitle, (lessonIndex + 2) % 5);
  const person = pick(lx.people, seed + lessonIndex);
  const place = pick(lx.places, seed * 2 + lessonIndex);
  const food = pick(lx.foods, seed * 3 + lessonIndex);
  const verb = pick(lx.verbs, seed * 5 + lessonIndex);
  const number = pick(lx.numbers, seed * 7 + lessonIndex);
  const phrase = `${person} ${verb} ${place}`;

  return [
    {
      id: `${lessonId}-e1`,
      type: "multiple-choice",
      question: `Which ${langName} word means "${card.english}"?`,
      options: shuffleOptions([card.target, support.target, food, number], seed),
      correctAnswer: card.target,
    },
    {
      id: `${lessonId}-e2`,
      type: "translation",
      question: `Type the ${langName} word for "${support.english}".`,
      correctAnswer: support.target,
      acceptedAnswers: [support.target, support.target.toLowerCase()],
    },
    {
      id: `${lessonId}-e3`,
      type: "audio",
      question: "Listen and choose the phrase you heard.",
      audioText: phrase,
      options: shuffleOptions([phrase, `${food} ${verb} ${number}`, `${place} ${lx.goodbye}`, `${lx.greeting} ${support.target}`], seed + 3),
      correctAnswer: phrase,
    },
    {
      id: `${lessonId}-e4`,
      type: "multiple-choice",
      question: "Choose the natural practice phrase for this lesson topic.",
      options: shuffleOptions([`${card.target} ${verb}`, `${lx.no} ${food}`, `${number} ${lx.thanks}`, `${place} ${person}`], seed + 9),
      correctAnswer: `${card.target} ${verb}`,
    },
  ];
}

function makeCourse(language: Lang, prefix: string): Course {
  const units: Unit[] = unitBlueprints.map((unit, unitIndex) => {
    const unitId = `${prefix}-u${unitIndex + 1}`;

    const lessons: Lesson[] = unit.lessonTitles.map((title, lessonIndex) => {
      const lessonId = `${unitId}-l${lessonIndex + 1}`;
      const seed = unitIndex * 17 + lessonIndex * 7 + prefix.charCodeAt(0);

      return {
        id: lessonId,
        title,
        description: `${unit.description} Focus: ${title}.`,
        xpReward: 12 + (lessonIndex % 4) * 3 + Math.floor(unitIndex / 3) * 2,
        exercises: makeExercises(language, unit.title, lessonId, title, lessonIndex, seed),
      };
    });

    return { id: unitId, title: unit.title, description: unit.description, lessons };
  });

  return { language, units };
}

const amharicCourse = makeCourse("amharic", "am");
const oromoCourse = makeCourse("oromo", "or");
const tigrinyaCourse = makeCourse("tigrinya", "ti");

export const courses: Record<string, Course> = {
  amharic: amharicCourse,
  oromo: oromoCourse,
  tigrinya: tigrinyaCourse,
};

export function getCourse(language: string): Course {
  return courses[language] || amharicCourse;
}

export function getLesson(language: string, lessonId: string): Lesson | undefined {
  const course = getCourse(language);
  for (const unit of course.units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getNextLesson(language: string, lessonId: string): Lesson | undefined {
  const lessons = getCourse(language).units.flatMap((unit) => unit.lessons);
  const currentIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
  return currentIndex >= 0 ? lessons[currentIndex + 1] : undefined;
}
