export interface Exercise {
  id: string;
  type: "multiple-choice" | "translation" | "audio";
  question: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string;
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
    greeting: "Selam",
    thanks: "Ameseginalehu",
    goodbye: "Dehna hun",
    yes: "Awo",
    no: "Aydellem",
    numbers: ["and", "hulet", "sost", "arat", "amist", "sidist", "sebat", "siment", "zetegn", "asir"],
    people: ["enat", "abat", "wendim", "ehet", "memhir", "temari"],
    places: ["bet", "suq", "timhirt bet", "addis", "mender"],
    foods: ["injera", "shiro", "buna", "dabo", "wot"],
    verbs: ["hed", "metta", "bel", "teyik", "moker"],
  },
  oromo: {
    greeting: "Nagaa",
    thanks: "Galatoomaa",
    goodbye: "Nagaatti",
    yes: "Eeyyee",
    no: "Lakki",
    numbers: ["tokko", "lama", "sadii", "afur", "shan", "jaha", "torba", "saddeet", "sagal", "kudhan"],
    people: ["haadha", "abba", "obboleessa", "obboleettii", "barsiisaa", "barataa"],
    places: ["mana", "gabaa", "mana barumsaa", "magaalaa", "baadiyyaa"],
    foods: ["buddeena", "ittoo", "buna", "annaan", "foon"],
    verbs: ["deemi", "kottu", "nyaadhu", "gaafadhu", "shaakali"],
  },
  tigrinya: {
    greeting: "Selam",
    thanks: "Yekenyeley",
    goodbye: "Dehan kun",
    yes: "Ee",
    no: "Aykonen",
    numbers: ["hade", "kilte", "seleste", "arbaete", "hamushte", "shudushte", "shewate", "shimente", "tishate", "aserte"],
    people: ["ade", "ab", "haw", "hafti", "memhir", "temhari"],
    places: ["geza", "suuq", "bet timhrti", "asmera", "qushet"],
    foods: ["injera", "shiro", "buna", "himbasha", "tsahli"],
    verbs: ["deyeb", "nsi", "bela", "hato", "moker"],
  },
};

const unitBlueprints: Array<{ title: string; description: string; lessonTitles: string[] }> = [
  {
    title: "Foundations",
    description: "Greetings, polite phrases, and survival basics.",
    lessonTitles: ["Hello and Goodbye", "Polite Words", "Introducing Yourself", "Simple Questions", "Mini Conversation"],
  },
  {
    title: "Numbers and Time",
    description: "Count, tell time, and discuss schedules.",
    lessonTitles: ["Numbers 1-10", "Numbers 11-100", "Days of Week", "Telling Time", "Daily Schedule"],
  },
  {
    title: "People and Family",
    description: "Talk about family, friends, and roles.",
    lessonTitles: ["Family Members", "Describing People", "Professions", "Age and Birthday", "Social Introductions"],
  },
  {
    title: "Home and Places",
    description: "Navigate locations and home vocabulary.",
    lessonTitles: ["Home Vocabulary", "Directions", "Neighborhood", "At School", "City vs Village"],
  },
  {
    title: "Food and Market",
    description: "Order food and shop with confidence.",
    lessonTitles: ["Common Foods", "At the Market", "Ordering Meals", "Quantities and Prices", "Food Preferences"],
  },
  {
    title: "Actions and Verbs",
    description: "Core verbs and sentence building.",
    lessonTitles: ["Common Verbs", "Present Actions", "Past Actions", "Future Plans", "Mixed Practice"],
  },
  {
    title: "Travel and Transport",
    description: "Move around and ask travel questions.",
    lessonTitles: ["Transportation Words", "Buying Tickets", "Asking Routes", "At the Station", "Trip Dialogues"],
  },
  {
    title: "Health and Wellbeing",
    description: "Explain basic health needs and feelings.",
    lessonTitles: ["Body and Feelings", "At the Clinic", "Describing Symptoms", "Advice and Help", "Health Check Dialogue"],
  },
  {
    title: "Work and Study",
    description: "Use language in school and workplace contexts.",
    lessonTitles: ["Classroom Language", "Office Expressions", "Tasks and Deadlines", "Meetings and Notes", "Formal Conversation"],
  },
  {
    title: "Culture and Community",
    description: "Learn language tied to culture and social life.",
    lessonTitles: ["Holidays", "Community Events", "Traditions", "Music and Stories", "Cultural Dialogue"],
  },
  {
    title: "Intermediate Fluency",
    description: "Longer comprehension and response drills.",
    lessonTitles: ["Listening Practice", "Reading Short Texts", "Responding Naturally", "Error Correction", "Fluency Challenge"],
  },
  {
    title: "Mastery Path",
    description: "Advanced mixed practice and review.",
    lessonTitles: ["Advanced Vocabulary", "Complex Sentences", "Scenario Simulation", "Fast Review", "Final Mastery Test"],
  },
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function makeExercises(language: Lang, lessonId: string, lessonTitle: string, seed: number): Exercise[] {
  const lx = lexicons[language];
  const n1 = pick(lx.numbers, seed);
  const n2 = pick(lx.numbers, seed + 2);
  const person = pick(lx.people, seed + 1);
  const place = pick(lx.places, seed + 3);
  const food = pick(lx.foods, seed + 4);
  const verb = pick(lx.verbs, seed + 5);

  return [
    {
      id: `${lessonId}-e1`,
      type: "multiple-choice",
      question: `In ${lessonTitle}, pick the polite phrase used most for gratitude in ${language}.`,
      options: [lx.thanks, lx.greeting, lx.goodbye, lx.no],
      correctAnswer: lx.thanks,
    },
    {
      id: `${lessonId}-e2`,
      type: "translation",
      question: `Translate this target word to ${language}: "yes"`,
      correctAnswer: lx.yes,
    },
    {
      id: `${lessonId}-e3`,
      type: "audio",
      question: `Listen and choose the best meaning for "${person} ${verb}" in context.`,
      audioText: `${person} ${verb}`,
      options: ["person + action", "food + action", "place + time", "number + greeting"],
      correctAnswer: "person + action",
    },
    {
      id: `${lessonId}-e4`,
      type: "multiple-choice",
      question: `Which option is a valid ${language} study phrase from this lesson set?`,
      options: [`${lx.greeting} ${n1}`, `${food} ${place}`, `${n2} ${lx.goodbye}`, `${lx.no} ${lx.thanks}`],
      correctAnswer: `${lx.greeting} ${n1}`,
    },
  ];
}

function makeCourse(language: Lang, prefix: string): Course {
  const units: Unit[] = unitBlueprints.map((unit, unitIndex) => {
    const unitId = `${prefix}-u${unitIndex + 1}`;

    const lessons: Lesson[] = unit.lessonTitles.map((title, lessonIndex) => {
      const lessonId = `${unitId}-l${lessonIndex + 1}`;
      const seed = unitIndex * 10 + lessonIndex;

      return {
        id: lessonId,
        title,
        description: `${unit.description} Focus: ${title}.`,
        xpReward: 12 + (lessonIndex % 4) * 3 + Math.floor(unitIndex / 3) * 2,
        exercises: makeExercises(language, lessonId, title, seed),
      };
    });

    return {
      id: unitId,
      title: unit.title,
      description: unit.description,
      lessons,
    };
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
