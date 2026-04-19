export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'translation' | 'audio';
  question: string;
  /** For audio exercises, the phonetic or script to pronounce */
  audioText?: string;
  options?: string[];
  correctAnswer: string;
  /** Optional image hint */
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
  language: 'amharic' | 'oromo' | 'tigrinya';
  units: Unit[];
}

const amharicCourse: Course = {
  language: 'amharic',
  units: [
    {
      id: 'am-u1',
      title: 'Greetings',
      description: 'Learn basic greetings and introductions',
      lessons: [
        {
          id: 'am-u1-l1',
          title: 'Hello & Goodbye',
          description: 'Basic greetings',
          xpReward: 10,
          exercises: [
            {
              id: 'am-u1-l1-e1',
              type: 'multiple-choice',
              question: 'What does "ሰላም" (Selam) mean?',
              options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
              correctAnswer: 'Hello',
            },
            {
              id: 'am-u1-l1-e2',
              type: 'translation',
              question: 'Translate to English: "ደህና ሁን"',
              correctAnswer: 'Goodbye',
            },
            {
              id: 'am-u1-l1-e3',
              type: 'audio',
              question: 'Listen and select the correct meaning',
              audioText: 'ሰላም',
              options: ['Hello / Peace', 'Water', 'Food', 'House'],
              correctAnswer: 'Hello / Peace',
            },
            {
              id: 'am-u1-l1-e4',
              type: 'multiple-choice',
              question: 'How do you say "Good morning" in Amharic?',
              options: ['እንደምን አደርክ', 'ሰላም', 'አመሰግናለሁ', 'ይቅርታ'],
              correctAnswer: 'እንደምን አደርክ',
            },
            {
              id: 'am-u1-l1-e5',
              type: 'translation',
              question: 'Translate to Amharic: "Hello"',
              correctAnswer: 'ሰላም',
            },
          ],
        },
        {
          id: 'am-u1-l2',
          title: 'How are you?',
          description: 'Asking about well-being',
          xpReward: 10,
          exercises: [
            {
              id: 'am-u1-l2-e1',
              type: 'multiple-choice',
              question: 'What does "እንደምን ነህ?" mean?',
              options: ['How are you?', 'What is your name?', 'Where are you?', 'Who are you?'],
              correctAnswer: 'How are you?',
            },
            {
              id: 'am-u1-l2-e2',
              type: 'translation',
              question: 'Translate: "I am fine" → Amharic',
              correctAnswer: 'ደህና ነኝ',
            },
            {
              id: 'am-u1-l2-e3',
              type: 'audio',
              question: 'Listen and choose the correct phrase',
              audioText: 'እንደምን ነህ',
              options: ['How are you?', 'Good night', 'See you later', 'Welcome'],
              correctAnswer: 'How are you?',
            },
            {
              id: 'am-u1-l2-e4',
              type: 'multiple-choice',
              question: '"አመሰግናለሁ" means:',
              options: ['Thank you', 'Sorry', 'Please', 'Yes'],
              correctAnswer: 'Thank you',
            },
          ],
        },
        {
          id: 'am-u1-l3',
          title: 'Introductions',
          description: 'Tell people your name',
          xpReward: 15,
          exercises: [
            {
              id: 'am-u1-l3-e1',
              type: 'multiple-choice',
              question: 'How do you say "My name is..." in Amharic?',
              options: ['ስሜ ... ነው', 'ቤቴ ... ነው', 'ሀገሬ ... ነው', 'ሥራዬ ... ነው'],
              correctAnswer: 'ስሜ ... ነው',
            },
            {
              id: 'am-u1-l3-e2',
              type: 'translation',
              question: 'Translate: "What is your name?"',
              correctAnswer: 'ስምህ ማን ነው',
            },
            {
              id: 'am-u1-l3-e3',
              type: 'audio',
              question: 'Listen and identify the phrase',
              audioText: 'ስሜ ዳዊት ነው',
              options: ['My name is Dawit', 'I am a student', 'I live in Addis', 'I am happy'],
              correctAnswer: 'My name is Dawit',
            },
          ],
        },
      ],
    },
    {
      id: 'am-u2',
      title: 'Numbers',
      description: 'Learn to count in Amharic',
      lessons: [
        {
          id: 'am-u2-l1',
          title: 'Numbers 1-5',
          description: 'Count from one to five',
          xpReward: 10,
          exercises: [
            {
              id: 'am-u2-l1-e1',
              type: 'multiple-choice',
              question: 'What is "አንድ" in English?',
              options: ['One', 'Two', 'Three', 'Four'],
              correctAnswer: 'One',
            },
            {
              id: 'am-u2-l1-e2',
              type: 'translation',
              question: 'Translate: "Three"',
              correctAnswer: 'ሦስት',
            },
            {
              id: 'am-u2-l1-e3',
              type: 'audio',
              question: 'Listen: which number is this?',
              audioText: 'ሁለት',
              options: ['Two', 'Five', 'One', 'Four'],
              correctAnswer: 'Two',
            },
            {
              id: 'am-u2-l1-e4',
              type: 'multiple-choice',
              question: '"አምስት" means:',
              options: ['Five', 'Ten', 'Three', 'Seven'],
              correctAnswer: 'Five',
            },
          ],
        },
        {
          id: 'am-u2-l2',
          title: 'Numbers 6-10',
          description: 'Count from six to ten',
          xpReward: 10,
          exercises: [
            {
              id: 'am-u2-l2-e1',
              type: 'multiple-choice',
              question: 'What is "ስድስት" in English?',
              options: ['Six', 'Seven', 'Eight', 'Nine'],
              correctAnswer: 'Six',
            },
            {
              id: 'am-u2-l2-e2',
              type: 'translation',
              question: 'Translate "Ten" to Amharic',
              correctAnswer: 'አስር',
            },
            {
              id: 'am-u2-l2-e3',
              type: 'audio',
              question: 'Listen: which number?',
              audioText: 'ዘጠኝ',
              options: ['Nine', 'Six', 'Eight', 'Seven'],
              correctAnswer: 'Nine',
            },
          ],
        },
      ],
    },
    {
      id: 'am-u3',
      title: 'Family',
      description: 'Learn family member vocabulary',
      lessons: [
        {
          id: 'am-u3-l1',
          title: 'Parents & Siblings',
          description: 'Mother, father, brother, sister',
          xpReward: 15,
          exercises: [
            {
              id: 'am-u3-l1-e1',
              type: 'multiple-choice',
              question: '"እናት" means:',
              options: ['Mother', 'Father', 'Sister', 'Brother'],
              correctAnswer: 'Mother',
            },
            {
              id: 'am-u3-l1-e2',
              type: 'translation',
              question: 'Translate: "Father"',
              correctAnswer: 'አባት',
            },
            {
              id: 'am-u3-l1-e3',
              type: 'audio',
              question: 'Listen and choose',
              audioText: 'ወንድም',
              options: ['Brother', 'Sister', 'Uncle', 'Cousin'],
              correctAnswer: 'Brother',
            },
            {
              id: 'am-u3-l1-e4',
              type: 'multiple-choice',
              question: 'How do you say "Sister"?',
              options: ['እህት', 'እናት', 'ሴት', 'ልጅ'],
              correctAnswer: 'እህት',
            },
          ],
        },
      ],
    },
  ],
};

const oromoCourse: Course = {
  language: 'oromo',
  units: [
    {
      id: 'or-u1',
      title: 'Greetings',
      description: 'Basic Afaan Oromo greetings',
      lessons: [
        {
          id: 'or-u1-l1',
          title: 'Hello & Goodbye',
          description: 'Learn to greet in Oromo',
          xpReward: 10,
          exercises: [
            {
              id: 'or-u1-l1-e1',
              type: 'multiple-choice',
              question: 'What does "Akkam" mean?',
              options: ['How are you?', 'Hello', 'Goodbye', 'Thank you'],
              correctAnswer: 'How are you?',
            },
            {
              id: 'or-u1-l1-e2',
              type: 'translation',
              question: 'Translate: "Nagaatti" to English',
              correctAnswer: 'Goodbye',
            },
            {
              id: 'or-u1-l1-e3',
              type: 'audio',
              question: 'Listen and select the meaning',
              audioText: 'Akkam',
              options: ['How are you?', 'Welcome', 'Good night', 'Please'],
              correctAnswer: 'How are you?',
            },
            {
              id: 'or-u1-l1-e4',
              type: 'multiple-choice',
              question: '"Galatoomaa" means:',
              options: ['Thank you', 'Sorry', 'Yes', 'No'],
              correctAnswer: 'Thank you',
            },
          ],
        },
      ],
    },
    {
      id: 'or-u2',
      title: 'Numbers',
      description: 'Count in Afaan Oromo',
      lessons: [
        {
          id: 'or-u2-l1',
          title: 'Numbers 1-5',
          description: 'Basic counting',
          xpReward: 10,
          exercises: [
            {
              id: 'or-u2-l1-e1',
              type: 'multiple-choice',
              question: '"Tokko" means:',
              options: ['One', 'Two', 'Three', 'Five'],
              correctAnswer: 'One',
            },
            {
              id: 'or-u2-l1-e2',
              type: 'translation',
              question: 'Translate: "Three" to Oromo',
              correctAnswer: 'Sadii',
            },
            {
              id: 'or-u2-l1-e3',
              type: 'audio',
              question: 'Listen: which number?',
              audioText: 'Lama',
              options: ['Two', 'Four', 'One', 'Five'],
              correctAnswer: 'Two',
            },
          ],
        },
      ],
    },
  ],
};

const tigrinyaCourse: Course = {
  language: 'tigrinya',
  units: [
    {
      id: 'ti-u1',
      title: 'Greetings',
      description: 'Basic Tigrinya greetings',
      lessons: [
        {
          id: 'ti-u1-l1',
          title: 'Hello & Goodbye',
          description: 'Greet in Tigrinya',
          xpReward: 10,
          exercises: [
            {
              id: 'ti-u1-l1-e1',
              type: 'multiple-choice',
              question: 'What does "ሰላም" mean in Tigrinya?',
              options: ['Hello', 'Goodbye', 'Sorry', 'Thanks'],
              correctAnswer: 'Hello',
            },
            {
              id: 'ti-u1-l1-e2',
              type: 'translation',
              question: 'Translate: "ደሓን ኩን" to English',
              correctAnswer: 'Goodbye',
            },
            {
              id: 'ti-u1-l1-e3',
              type: 'audio',
              question: 'Listen and choose',
              audioText: 'ከመይ ኣለኻ',
              options: ['How are you?', 'Good morning', 'Thank you', 'Welcome'],
              correctAnswer: 'How are you?',
            },
            {
              id: 'ti-u1-l1-e4',
              type: 'multiple-choice',
              question: '"የቐንየለይ" means:',
              options: ['Thank you', 'Please', 'Sorry', 'Yes'],
              correctAnswer: 'Thank you',
            },
          ],
        },
      ],
    },
    {
      id: 'ti-u2',
      title: 'Numbers',
      description: 'Count in Tigrinya',
      lessons: [
        {
          id: 'ti-u2-l1',
          title: 'Numbers 1-5',
          description: 'Basic counting',
          xpReward: 10,
          exercises: [
            {
              id: 'ti-u2-l1-e1',
              type: 'multiple-choice',
              question: '"ሓደ" means:',
              options: ['One', 'Two', 'Three', 'Four'],
              correctAnswer: 'One',
            },
            {
              id: 'ti-u2-l1-e2',
              type: 'translation',
              question: 'Translate "Two" to Tigrinya',
              correctAnswer: 'ክልተ',
            },
            {
              id: 'ti-u2-l1-e3',
              type: 'audio',
              question: 'Listen: which number?',
              audioText: 'ሰለስተ',
              options: ['Three', 'Five', 'One', 'Four'],
              correctAnswer: 'Three',
            },
          ],
        },
      ],
    },
  ],
};

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
    const lesson = unit.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}
