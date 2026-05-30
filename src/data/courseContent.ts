export interface Exercise {
  id: string;
  type: "multiple-choice" | "translation" | "audio";
  question: string;
  audioText?: string;
  options?: string[];
  optionLabels?: Record<string, string>;
  correctAnswer: string;
  correctAnswerLabel?: string;
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

const scriptLabels: Partial<Record<Lang, Record<string, string>>> = {
  amharic: {
    fidel: "ፊደል",
    dimts: "ድምፅ",
    kal: "ቃል",
    anbeb: "አንብብ",
    tsaf: "ፃፍ",
    selam: "ሰላም",
    "endemin neh?": "እንደምን ነህ?",
    "dehna negn": "ደህና ነኝ",
    "dehna aderk": "ደህና አደርክ",
    "dehna hun": "ደህና ሁን",
    ameseginalehu: "አመሰግናለሁ",
    ebakih: "እባክህ",
    yikirta: "ይቅርታ",
    "minim aydelem": "ምንም አይደለም",
    "sime ... new": "ስሜ ... ነው",
    "temari negn": "ተማሪ ነኝ",
    "ke ... negn": "ከ ... ነኝ",
    "bemawkish des yilegnyal": "በማወቅህ ደስ ይለኛል",
    "simih man new?": "ስምህ ማን ነው?",
    awo: "አዎ",
    aydellem: "አይደለም",
    eshi: "እሺ",
    "gebto?al": "ገብቶኛል",
    algebagnim: "አልገባኝም",
    and: "አንድ",
    hulet: "ሁለት",
    sost: "ሶስት",
    arat: "አራት",
    amist: "አምስት",
    sidist: "ስድስት",
    sebat: "ሰባት",
    siment: "ስምንት",
    zetegn: "ዘጠኝ",
    asir: "አስር",
    segno: "ሰኞ",
    maksenyo: "ማክሰኞ",
    rob: "ረቡዕ",
    hamus: "ሐሙስ",
    arb: "አርብ",
    meskerem: "መስከረም",
    tikimt: "ጥቅምት",
    hidar: "ህዳር",
    tahsas: "ታህሳስ",
    tir: "ጥር",
    seat: "ሰዓት",
    tuwat: "ጠዋት",
    zare: "ዛሬ",
    nege: "ነገ",
    ahun: "አሁን",
    ehedalehu: "እሄዳለሁ",
    eblalehu: "እበላለሁ",
    etemaralehu: "እማራለሁ",
    etenalehu: "እተኛለሁ",
    eseralew: "እሰራለሁ",
    enat: "እናት",
    abat: "አባት",
    wendim: "ወንድም",
    ehet: "እህት",
    beteseb: "ቤተሰብ",
    bet: "ቤት",
    suq: "ሱቅ",
    "timhirt bet": "ትምህርት ቤት",
    "yet new?": "የት ነው?",
    gra: "ግራ",
    qegn: "ቀኝ",
    tekarab: "ተቃረብ",
    irq: "ሩቅ",
  },
  tigrinya: {
    fidel: "ፊደል",
    dimtsi: "ድምጺ",
    qal: "ቃል",
    anbeb: "ኣንብብ",
    tsihaf: "ጽሓፍ",
    selam: "ሰላም",
    "kemey aleka?": "ከመይ ኣለኻ?",
    "dehan aloku": "ደሓን ኣለኹ",
    "dehan hadirka": "ደሓን ሓዲርካ",
    "dehan kun": "ደሓን ኩን",
    yekenyeley: "የቐንየለይ",
    bjaaka: "ብጃኻ",
    yikirta: "ይቕረታ",
    "gnzebka": "ግንዛብካ",
    "shimay ... iyu": "ሽመይ ... እዩ",
    "temhari eye": "ተምሃራይ እየ",
    "kab ... eye": "ካብ ... እየ",
    "bimefletka des iluni": "ብምፍላጥካ ደስ ኢሉኒ",
    "shimka men iyu?": "ሽምካ መን እዩ?",
    ee: "እወ",
    aykonen: "ኣይኮነን",
    haye: "ሓየ",
    "terediuni": "ተረዲኡኒ",
    "ayteredeanin": "ኣይተረደኣንን",
    hade: "ሓደ",
    kilte: "ክልተ",
    seleste: "ሰለስተ",
    arbaete: "ኣርባዕተ",
    hamushte: "ሓሙሽተ",
    shudushte: "ሽዱሽተ",
    shewate: "ሸውዓተ",
    shimente: "ሸሞንተ",
    tishate: "ትሽዓተ",
    aserte: "ዓሰርተ",
    segno: "ሰኑይ",
    tselam: "ሰሉስ",
    arba: "ረቡዕ",
    hamus: "ሓሙስ",
    arb: "ዓርቢ",
    september: "መስከረም",
    october: "ጥቅምቲ",
    november: "ሕዳር",
    december: "ታሕሳስ",
    january: "ጥሪ",
    saat: "ሰዓት",
    nigho: "ንግሆ",
    leomi: "ሎሚ",
    tsibah: "ጽባሕ",
    hitsi: "ሕጂ",
    ade: "ኣደ",
    ab: "ኣቦ",
    haw: "ሓው",
    hafti: "ሓፍቲ",
    seb: "ስብ",
    geza: "ገዛ",
    suuq: "ዱኳን",
    "bet timhrti": "ቤት ትምህርቲ",
    "abey alo?": "ኣበይ ኣሎ?",
    tsegam: "ጸጋም",
    yeman: "የማን",
    qeribu: "ቀረባ",
    riHuq: "ርሑቕ",
  },
};

function labelFor(language: Lang, value: string): string {
  const map = scriptLabels[language];
  const wordScripts = value.split(" ").map((part) => map?.[part]);
  const script = map?.[value] ?? (wordScripts.every(Boolean) ? wordScripts.join(" ") : undefined);
  return script ? `${value} / ${script}` : value;
}

function labelsFor(language: Lang, values: string[]): Record<string, string> {
  return values.reduce<Record<string, string>>((labels, value) => {
    labels[value] = labelFor(language, value);
    return labels;
  }, {});
}

function acceptedWithScript(language: Lang, value: string): string[] {
  const label = labelFor(language, value);
  const script = label.includes(" / ") ? label.split(" / ")[1] : undefined;
  return [value, value.toLowerCase(), ...(script ? [script] : [])];
}

const unitBlueprints: Array<{ title: string; description: string; lessonTitles: string[] }> = [
  {
    title: "Foundations",
    description: "Characters, pronunciation, greetings, polite phrases, and survival basics.",
    lessonTitles: ["Learn Characters", "Vowels and Sounds", "Syllable Practice", "Greetings", "Polite Words", "Introducing Yourself", "Asking Simple Questions", "Yes No and Maybe", "Mini Conversation", "Survival Review"],
  },
  {
    title: "Numbers and Time",
    description: "Learn numbers, dates, days, months, clock time, and daily schedules.",
    lessonTitles: ["Learn Numbers", "Numbers 11 to 20", "Counting Objects", "Days of the Week", "Months of the Year", "Telling Time", "Morning and Evening", "Today Tomorrow Yesterday", "Daily Schedule", "Time Review"],
  },
  {
    title: "People and Family",
    description: "Talk about family, friends, roles, relationships, and personal details.",
    lessonTitles: ["Family Members", "Extended Family", "Describing People", "Professions", "Age and Birthday", "Possession Words", "Talking About Friends", "Social Introductions", "Respectful Address", "Family Review"],
  },
  {
    title: "Home and Places",
    description: "Name places, navigate neighborhoods, and ask clear direction questions.",
    lessonTitles: ["Learn Directions", "Rooms at Home", "Household Objects", "Asking Directions", "Neighborhood", "At School", "At the Shop", "City vs Village", "Where Questions", "Places Review"],
  },
  {
    title: "Food and Market",
    description: "Order meals, discuss preferences, shop at markets, and ask prices.",
    lessonTitles: ["Common Foods", "Drinks and Coffee", "At the Market", "Ordering Meals", "Quantities and Prices", "Food Preferences", "Buying Ingredients", "Restaurant Dialogue", "Market Bargaining", "Food Review"],
  },
  {
    title: "Actions and Verbs",
    description: "Build sentences with common actions, tense patterns, and useful connectors.",
    lessonTitles: ["Common Verbs", "Present Actions", "Past Actions", "Future Plans", "Commands and Requests", "Can and Want", "Like and Need", "Questions with Verbs", "Mixed Practice", "Verb Review"],
  },
  {
    title: "Travel and Transport",
    description: "Move around confidently with transportation, route, ticket, and trip language.",
    lessonTitles: ["Transportation Words", "Buying Tickets", "Asking Routes", "At the Station", "Taxi and Bus Phrases", "Hotel Check In", "Travel Problems", "Trip Dialogues", "Airport Basics", "Travel Review"],
  },
  {
    title: "Health and Wellbeing",
    description: "Explain symptoms, needs, feelings, safety concerns, and simple advice.",
    lessonTitles: ["Body and Feelings", "At the Clinic", "Describing Symptoms", "Advice and Help", "Medicine and Pharmacy", "Emergency Phrases", "Feelings and Mood", "Healthy Habits", "Health Check Dialogue", "Health Review"],
  },
  {
    title: "Work and Study",
    description: "Use language in classrooms, offices, meetings, tasks, and formal requests.",
    lessonTitles: ["Classroom Language", "Office Expressions", "Tasks and Deadlines", "Meetings and Notes", "Emails and Messages", "Asking for Clarification", "Giving Opinions", "Formal Conversation", "Study Plan", "Work Review"],
  },
  {
    title: "Culture and Community",
    description: "Learn respectful language tied to holidays, community life, stories, and traditions.",
    lessonTitles: ["Holidays", "Community Events", "Traditions", "Music and Stories", "Invitations", "Guests and Hosting", "Religious and Cultural Respect", "Celebration Dialogue", "Proverbs and Wisdom", "Culture Review"],
  },
  {
    title: "Intermediate Fluency",
    description: "Grow comprehension with longer listening, reading, response, and correction drills.",
    lessonTitles: ["Listening Practice", "Reading Short Texts", "Responding Naturally", "Error Correction", "Longer Questions", "Short Story Practice", "Giving Reasons", "Comparing Things", "Fluency Challenge", "Intermediate Review"],
  },
  {
    title: "Mastery Path",
    description: "Advanced mixed practice for conversations, scenarios, review, and final mastery.",
    lessonTitles: ["Advanced Vocabulary", "Complex Sentences", "Scenario Simulation", "Fast Review", "Final Mastery Test", "Conversation Repair", "Narrating Events", "Debate and Opinion", "Listening Speed Run", "Mastery Review"],
  },
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



type PracticalEntry = {
  english: string;
  target: string;
};

const practicalLessonPacks: Record<Lang, Record<string, PracticalEntry[]>> = {
  amharic: {
    "Learn Characters": [
      { english: "letter", target: "fidel" },
      { english: "sound", target: "dimts" },
      { english: "word", target: "kal" },
      { english: "read", target: "anbeb" },
      { english: "write", target: "tsaf" },
    ],
    Greetings: [
      { english: "hello", target: "selam" },
      { english: "how are you?", target: "endemin neh?" },
      { english: "I am fine", target: "dehna negn" },
      { english: "good morning", target: "dehna aderk" },
      { english: "goodbye", target: "dehna hun" },
    ],
    "Polite Words": [
      { english: "thank you", target: "ameseginalehu" },
      { english: "please", target: "ebakih" },
      { english: "sorry", target: "yikirta" },
      { english: "excuse me", target: "yikirta" },
      { english: "you are welcome", target: "minim aydelem" },
    ],
    "Introducing Yourself": [
      { english: "my name is", target: "sime ... new" },
      { english: "I am a student", target: "temari negn" },
      { english: "I am from", target: "ke ... negn" },
      { english: "nice to meet you", target: "bemawkish des yilegnyal" },
      { english: "what is your name?", target: "simih man new?" },
    ],
    "Mini Conversation": [
      { english: "yes", target: "awo" },
      { english: "no", target: "aydellem" },
      { english: "okay", target: "eshi" },
      { english: "I understand", target: "gebto?al" },
      { english: "I do not understand", target: "algebagnim" },
    ],
    "Learn Numbers": [
      { english: "one", target: "and" },
      { english: "two", target: "hulet" },
      { english: "three", target: "sost" },
      { english: "four", target: "arat" },
      { english: "five", target: "amist" },
    ],
    "Days of the Week": [
      { english: "Monday", target: "segno" },
      { english: "Tuesday", target: "maksenyo" },
      { english: "Wednesday", target: "rob" },
      { english: "Thursday", target: "hamus" },
      { english: "Friday", target: "arb" },
    ],
    "Months of the Year": [
      { english: "September", target: "meskerem" },
      { english: "October", target: "tikimt" },
      { english: "November", target: "hidar" },
      { english: "December", target: "tahsas" },
      { english: "January", target: "tir" },
    ],
    "Telling Time": [
      { english: "time", target: "seat" },
      { english: "morning", target: "tuwat" },
      { english: "today", target: "zare" },
      { english: "tomorrow", target: "nege" },
      { english: "now", target: "ahun" },
    ],
    "Daily Schedule": [
      { english: "I go", target: "ehedalehu" },
      { english: "I eat", target: "eblalehu" },
      { english: "I study", target: "etemaralehu" },
      { english: "I sleep", target: "etenalehu" },
      { english: "I work", target: "eseralew" },
    ],
    "Family Members": [
      { english: "mother", target: "enat" },
      { english: "father", target: "abat" },
      { english: "brother", target: "wendim" },
      { english: "sister", target: "ehet" },
      { english: "family", target: "beteseb" },
    ],
    "Learn Directions": [
      { english: "where is it?", target: "yet new?" },
      { english: "left", target: "gra" },
      { english: "right", target: "qegn" },
      { english: "near", target: "tekarab" },
      { english: "far", target: "irq" },
    ],
  },
  oromo: {
    "Learn Characters": [
      { english: "letter", target: "qubee" },
      { english: "sound", target: "sagalee" },
      { english: "word", target: "jecha" },
      { english: "read", target: "dubbisi" },
      { english: "write", target: "barreessi" },
    ],
    Greetings: [
      { english: "hello", target: "akkam" },
      { english: "how are you?", target: "akkam jirta?" },
      { english: "I am fine", target: "nagaan jira" },
      { english: "good morning", target: "akkam bulte" },
      { english: "goodbye", target: "nagaatti" },
    ],
    "Polite Words": [
      { english: "thank you", target: "galatoomaa" },
      { english: "please", target: "maaloo" },
      { english: "sorry", target: "dhiifama" },
      { english: "excuse me", target: "dhiifama" },
      { english: "you are welcome", target: "homaa miti" },
    ],
    "Introducing Yourself": [
      { english: "my name is", target: "maqaan koo ..." },
      { english: "I am a student", target: "ani barataa dha" },
      { english: "I am from", target: "ani ... irraa dhufe" },
      { english: "nice to meet you", target: "si arguu kootti gammadeera" },
      { english: "what is your name?", target: "maqaan kee eenyu?" },
    ],
    "Mini Conversation": [
      { english: "yes", target: "eeyyee" },
      { english: "no", target: "lakki" },
      { english: "okay", target: "tole" },
      { english: "I understand", target: "naaf gale" },
      { english: "I do not understand", target: "naaf hin galle" },
    ],
    "Learn Numbers": [
      { english: "one", target: "tokko" },
      { english: "two", target: "lama" },
      { english: "three", target: "sadii" },
      { english: "four", target: "afur" },
      { english: "five", target: "shan" },
    ],
    "Days of the Week": [
      { english: "Monday", target: "wiixata" },
      { english: "Tuesday", target: "kibxata" },
      { english: "Wednesday", target: "roobii" },
      { english: "Thursday", target: "kamisa" },
      { english: "Friday", target: "jimaata" },
    ],
    "Months of the Year": [
      { english: "January", target: "amajjii" },
      { english: "February", target: "guraandhala" },
      { english: "March", target: "bitootessa" },
      { english: "April", target: "ebla" },
      { english: "May", target: "caamsaa" },
    ],
    "Telling Time": [
      { english: "time", target: "sa'aatii" },
      { english: "morning", target: "ganama" },
      { english: "today", target: "har'a" },
      { english: "tomorrow", target: "boru" },
      { english: "now", target: "amma" },
    ],
    "Daily Schedule": [
      { english: "I go", target: "ani nan deema" },
      { english: "I eat", target: "ani nan nyaadha" },
      { english: "I study", target: "ani nan baradha" },
      { english: "I sleep", target: "ani nan rafa" },
      { english: "I work", target: "ani nan hojjadha" },
    ],
    "Family Members": [
      { english: "mother", target: "haadha" },
      { english: "father", target: "abba" },
      { english: "brother", target: "obboleessa" },
      { english: "sister", target: "obboleettii" },
      { english: "family", target: "maatii" },
    ],
    "Learn Directions": [
      { english: "where is it?", target: "eessa jira?" },
      { english: "left", target: "bitaa" },
      { english: "right", target: "mirga" },
      { english: "near", target: "dhihoo" },
      { english: "far", target: "fagoo" },
    ],
  },
  tigrinya: {
    "Learn Characters": [
      { english: "letter", target: "fidel" },
      { english: "sound", target: "dimtsi" },
      { english: "word", target: "qalat" },
      { english: "read", target: "anbeb" },
      { english: "write", target: "tsehif" },
    ],
    Greetings: [
      { english: "hello", target: "selam" },
      { english: "how are you?", target: "kemey aleka?" },
      { english: "I am fine", target: "dehan iye" },
      { english: "good morning", target: "dehan hadirka" },
      { english: "goodbye", target: "dehan kun" },
    ],
    "Polite Words": [
      { english: "thank you", target: "yekenyeley" },
      { english: "please", target: "beyjaka" },
      { english: "sorry", target: "yikirta" },
      { english: "excuse me", target: "yikirta" },
      { english: "you are welcome", target: "gnay zeykonen" },
    ],
    "Introducing Yourself": [
      { english: "my name is", target: "shimay ... iyu" },
      { english: "I am a student", target: "ane temhari iye" },
      { english: "I am from", target: "ane kab ... iye" },
      { english: "nice to meet you", target: "kimrekebeka des iluni" },
      { english: "what is your name?", target: "shimka men iyu?" },
    ],
    "Mini Conversation": [
      { english: "yes", target: "ee" },
      { english: "no", target: "aykonen" },
      { english: "okay", target: "hay" },
      { english: "I understand", target: "terediuni" },
      { english: "I do not understand", target: "aytereda'anin" },
    ],
    "Learn Numbers": [
      { english: "one", target: "hade" },
      { english: "two", target: "kilte" },
      { english: "three", target: "seleste" },
      { english: "four", target: "arbaete" },
      { english: "five", target: "hamushte" },
    ],
    "Days of the Week": [
      { english: "Monday", target: "segno" },
      { english: "Tuesday", target: "maksegno" },
      { english: "Wednesday", target: "rebu'e" },
      { english: "Thursday", target: "hamus" },
      { english: "Friday", target: "arbi" },
    ],
    "Months of the Year": [
      { english: "January", target: "january" },
      { english: "February", target: "february" },
      { english: "March", target: "march" },
      { english: "April", target: "april" },
      { english: "May", target: "may" },
    ],
    "Telling Time": [
      { english: "time", target: "sa'at" },
      { english: "morning", target: "nigho" },
      { english: "today", target: "lom'i" },
      { english: "tomorrow", target: "tsibah" },
      { english: "now", target: "hiji" },
    ],
    "Daily Schedule": [
      { english: "I go", target: "ane yekhed" },
      { english: "I eat", target: "ane yebela" },
      { english: "I study", target: "ane yemhar" },
      { english: "I sleep", target: "ane yedekis" },
      { english: "I work", target: "ane yeserih" },
    ],
    "Family Members": [
      { english: "mother", target: "ade" },
      { english: "father", target: "ab" },
      { english: "brother", target: "haw" },
      { english: "sister", target: "hafti" },
      { english: "family", target: "seb" },
    ],
    "Learn Directions": [
      { english: "where is it?", target: "abey alo?" },
      { english: "left", target: "tsegam" },
      { english: "right", target: "yeman" },
      { english: "near", target: "qeribu" },
      { english: "far", target: "rihuq" },
    ],
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
  const englishTopics = topicEnglish[unitTitle];
  const targetTopics = topicTargets[language][unitTitle];
  const topicIndex = lessonIndex % Math.min(englishTopics.length, targetTopics.length);
  const english = englishTopics[topicIndex];
  const target = targetTopics[topicIndex];
  return { english, target, category: unitTitle };
}


function makePracticalExercises(language: Lang, lessonId: string, lessonTitle: string, seed: number): Exercise[] | null {
  const entries = practicalLessonPacks[language][lessonTitle];
  if (!entries) return null;

  const langName = languageNames[language];
  const optionPool = entries.map((entry) => entry.target);
  const first = entries[0];
  const second = entries[1] ?? first;
  const third = entries[2] ?? first;
  const fourth = entries[3] ?? first;
  const fifth = entries[4] ?? first;
  const phrase = `${first.target} ${second.target}`;
  const firstOptions = shuffleOptions(optionPool, seed);
  const audioOptions = shuffleOptions([phrase, `${second.target} ${first.target}`, third.target, fourth.target], seed + 4);
  const meaningOptions = shuffleOptions(entries.map((entry) => entry.english), seed + 8);

  return [
    {
      id: `${lessonId}-p1`,
      type: "multiple-choice",
      question: `Which ${langName} phrase means "${first.english}"?`,
      options: firstOptions,
      optionLabels: labelsFor(language, firstOptions),
      correctAnswer: first.target,
      correctAnswerLabel: labelFor(language, first.target),
    },
    {
      id: `${lessonId}-p2`,
      type: "translation",
      question: `Type the ${langName} phrase for "${second.english}".`,
      correctAnswer: second.target,
      correctAnswerLabel: labelFor(language, second.target),
      acceptedAnswers: acceptedWithScript(language, second.target),
    },
    {
      id: `${lessonId}-p3`,
      type: "audio",
      question: "Listen and choose what you heard.",
      audioText: phrase,
      options: audioOptions,
      optionLabels: labelsFor(language, audioOptions),
      correctAnswer: phrase,
      correctAnswerLabel: labelFor(language, phrase),
    },
    {
      id: `${lessonId}-p4`,
      type: "multiple-choice",
      question: `What does "${third.target}" mean?`,
      options: meaningOptions,
      correctAnswer: third.english,
    },
    {
      id: `${lessonId}-p5`,
      type: "translation",
      question: `Type the ${langName} phrase for "${fifth.english}".`,
      correctAnswer: fifth.target,
      correctAnswerLabel: labelFor(language, fifth.target),
      acceptedAnswers: acceptedWithScript(language, fifth.target),
    },
  ];
}

function getUnitOpeningPack(language: Lang, unitTitle: string): PracticalEntry[] {
  const targets = topicTargets[language][unitTitle];
  const english = topicEnglish[unitTitle];
  return english.map((label, index) => ({ english: label, target: targets[index] }));
}

function makeExercises(language: Lang, unitTitle: string, lessonId: string, lessonTitle: string, lessonIndex: number, seed: number): Exercise[] {
  const practicalExercises = makePracticalExercises(language, lessonId, lessonTitle, seed);
  if (practicalExercises) return practicalExercises;

  if (lessonIndex === 0) {
    practicalLessonPacks[language][lessonTitle] = getUnitOpeningPack(language, unitTitle);
    const openingExercises = makePracticalExercises(language, lessonId, lessonTitle, seed);
    if (openingExercises) return openingExercises;
  }

  const lx = lexicons[language];
  const langName = languageNames[language];
  const card = getTopicCard(language, unitTitle, lessonIndex);
  const support = getTopicCard(language, unitTitle, lessonIndex + 2);
  const person = pick(lx.people, seed + lessonIndex);
  const place = pick(lx.places, seed * 2 + lessonIndex);
  const food = pick(lx.foods, seed * 3 + lessonIndex);
  const verb = pick(lx.verbs, seed * 5 + lessonIndex);
  const number = pick(lx.numbers, seed * 7 + lessonIndex);
  const phrase = `${person} ${verb} ${place}`;
  const wordOptions = shuffleOptions([card.target, support.target, food, number], seed);
  const audioOptions = shuffleOptions([phrase, `${food} ${verb} ${number}`, `${place} ${lx.goodbye}`, `${lx.greeting} ${support.target}`], seed + 3);
  const practiceOptions = shuffleOptions([`${card.target} ${verb}`, `${lx.no} ${food}`, `${number} ${lx.thanks}`, `${place} ${person}`], seed + 9);
  const examplePhrase = `${lx.greeting} ${card.target}`;
  const exampleOptions = shuffleOptions([examplePhrase, `${lx.thanks} ${support.target}`, `${person} ${place}`, `${food} ${number}`], seed + 12);

  return [
    {
      id: `${lessonId}-e1`,
      type: "multiple-choice",
      question: `Which ${langName} word means "${card.english}"?`,
      options: wordOptions,
      optionLabels: labelsFor(language, wordOptions),
      correctAnswer: card.target,
      correctAnswerLabel: labelFor(language, card.target),
    },
    {
      id: `${lessonId}-e2`,
      type: "translation",
      question: `Type the ${langName} word for "${support.english}".`,
      correctAnswer: support.target,
      correctAnswerLabel: labelFor(language, support.target),
      acceptedAnswers: acceptedWithScript(language, support.target),
    },
    {
      id: `${lessonId}-e3`,
      type: "audio",
      question: "Listen and choose the phrase you heard.",
      audioText: phrase,
      options: audioOptions,
      optionLabels: labelsFor(language, audioOptions),
      correctAnswer: phrase,
      correctAnswerLabel: labelFor(language, phrase),
    },
    {
      id: `${lessonId}-e4`,
      type: "multiple-choice",
      question: "Choose the natural practice phrase for this lesson topic.",
      options: practiceOptions,
      optionLabels: labelsFor(language, practiceOptions),
      correctAnswer: `${card.target} ${verb}`,
      correctAnswerLabel: labelFor(language, `${card.target} ${verb}`),
    },
    {
      id: `${lessonId}-e5`,
      type: "audio",
      question: `Listen for the example phrase using "${card.english}".`,
      audioText: examplePhrase,
      options: exampleOptions,
      optionLabels: labelsFor(language, exampleOptions),
      correctAnswer: examplePhrase,
      correctAnswerLabel: labelFor(language, examplePhrase),
    },
    {
      id: `${lessonId}-e6`,
      type: "translation",
      question: `Type the ${langName} word for this lesson example: "${card.english}".`,
      correctAnswer: card.target,
      correctAnswerLabel: labelFor(language, card.target),
      acceptedAnswers: acceptedWithScript(language, card.target),
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
