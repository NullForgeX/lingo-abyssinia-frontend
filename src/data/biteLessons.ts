export type BiteLanguage = "amharic" | "oromo" | "tigrinya";

export type BiteLessonItem = {
  title: string;
  english: string;
  target: string;
  script?: string;
  note: string;
  example?: string;
};

export type BiteLesson = {
  id: string;
  level: "Easy" | "Building" | "Useful" | "Advanced";
  title: string;
  goal: string;
  items: BiteLessonItem[];
  tip: string;
};

export const biteLanguageNames: Record<BiteLanguage, string> = {
  amharic: "Amharic",
  oromo: "Afan Oromoo",
  tigrinya: "Tigrinya",
};

const amharic: BiteLesson[] = [
  {
    id: "am-greetings",
    level: "Easy",
    title: "Greetings That Actually Start Conversations",
    goal: "Greet someone and answer back naturally.",
    tip: "Start with selam, then ask how they are. Keep your answer short and warm.",
    items: [
      { title: "Hello", english: "Hello", target: "selam", script: "ሰላም", note: "A safe greeting in most everyday situations.", example: "selam, endemin neh?" },
      { title: "How are you?", english: "How are you?", target: "endemin neh?", script: "እንደምን ነህ?", note: "Use this for one male friend or peer.", example: "selam, endemin neh?" },
      { title: "I am fine", english: "I am fine", target: "dehna negn", script: "ደህና ነኝ", note: "The most useful quick reply.", example: "dehna negn, ameseginalehu" },
      { title: "Good morning", english: "Good morning", target: "dehna aderk", script: "ደህና አደርክ", note: "Use in the morning when greeting one male person.", example: "dehna aderk" },
      { title: "Goodbye", english: "Goodbye", target: "dehna hun", script: "ደህና ሁን", note: "A friendly way to say farewell.", example: "dehna hun, nege enegenañ" },
    ],
  },
  {
    id: "am-politeness",
    level: "Easy",
    title: "Polite Words",
    goal: "Make requests, apologies, and thanks sound respectful.",
    tip: "These words are small, but they make your speech much more natural.",
    items: [
      { title: "Thank you", english: "Thank you", target: "ameseginalehu", script: "አመሰግናለሁ", note: "Use after help, food, directions, or service.", example: "ameseginalehu" },
      { title: "Please", english: "Please", target: "ebakih", script: "እባክህ", note: "Use with a request to one male person.", example: "ebakih, irdañ" },
      { title: "Sorry / excuse me", english: "Sorry", target: "yikirta", script: "ይቅርታ", note: "Use to apologize or politely get attention.", example: "yikirta, yet new?" },
      { title: "Yes", english: "Yes", target: "awo", script: "አዎ", note: "Simple yes.", example: "awo, dehna negn" },
      { title: "No", english: "No", target: "aydellem", script: "አይደለም", note: "Simple no / it is not.", example: "aydellem, ameseginalehu" },
    ],
  },
  {
    id: "am-numbers",
    level: "Building",
    title: "Numbers 1–10",
    goal: "Count and recognize small numbers.",
    tip: "Numbers help with prices, time, addresses, and ordering.",
    items: [
      { title: "One", english: "One", target: "and", script: "አንድ", note: "The number 1.", example: "and buna" },
      { title: "Two", english: "Two", target: "hulet", script: "ሁለት", note: "The number 2.", example: "hulet injera" },
      { title: "Three", english: "Three", target: "sost", script: "ሶስት", note: "The number 3.", example: "sost seat" },
      { title: "Five", english: "Five", target: "amist", script: "አምስት", note: "The number 5.", example: "amist birr" },
      { title: "Ten", english: "Ten", target: "asir", script: "አስር", note: "The number 10.", example: "asir birr" },
    ],
  },
  {
    id: "am-family",
    level: "Building",
    title: "Family Words",
    goal: "Talk about close family members.",
    tip: "Family words are useful in introductions and daily conversation.",
    items: [
      { title: "Mother", english: "Mother", target: "enat", script: "እናት", note: "Your mother.", example: "enate dehna nat" },
      { title: "Father", english: "Father", target: "abat", script: "አባት", note: "Your father.", example: "abate memhir new" },
      { title: "Brother", english: "Brother", target: "wendim", script: "ወንድም", note: "A brother.", example: "wendime temari new" },
      { title: "Sister", english: "Sister", target: "ehet", script: "እህት", note: "A sister.", example: "ehete bet nat" },
      { title: "Family", english: "Family", target: "beteseb", script: "ቤተሰብ", note: "Family as a group.", example: "betesebe dehna new" },
    ],
  },
  {
    id: "am-directions",
    level: "Useful",
    title: "Ask For Directions",
    goal: "Ask where something is and understand simple directions.",
    tip: "Start with yet new, then listen for left, right, near, or far.",
    items: [
      { title: "Where is it?", english: "Where is it?", target: "yet new?", script: "የት ነው?", note: "Use for places, objects, or a destination.", example: "suq yet new?" },
      { title: "Left", english: "Left", target: "gra", script: "ግራ", note: "A basic direction word.", example: "gra geba" },
      { title: "Right", english: "Right", target: "qegn", script: "ቀኝ", note: "A basic direction word.", example: "qegn geba" },
      { title: "Near", english: "Near", target: "qerib", script: "ቅርብ", note: "Use when something is close.", example: "betu qerib new" },
      { title: "Far", english: "Far", target: "ruq", script: "ሩቅ", note: "Use when something is far away.", example: "suqu ruq new" },
    ],
  },
  {
    id: "am-market",
    level: "Useful",
    title: "Market Basics",
    goal: "Ask prices and buy simple items.",
    tip: "Use sint new often. It means how much is it.",
    items: [
      { title: "How much is it?", english: "How much is it?", target: "sint new?", script: "ስንት ነው?", note: "Use when asking price.", example: "buna sint new?" },
      { title: "I want", english: "I want", target: "efeligalehu", script: "እፈልጋለሁ", note: "Useful for buying or requesting.", example: "and buna efeligalehu" },
      { title: "Coffee", english: "Coffee", target: "buna", script: "ቡና", note: "A very common word in Ethiopia.", example: "buna efeligalehu" },
      { title: "Bread", english: "Bread", target: "dabo", script: "ዳቦ", note: "Useful in shops and restaurants.", example: "hulet dabo" },
      { title: "Water", english: "Water", target: "wuha", script: "ውሃ", note: "Essential travel word.", example: "wuha efeligalehu" },
    ],
  },
  {
    id: "am-time-days",
    level: "Useful",
    title: "Time And Days",
    goal: "Talk about today, tomorrow, and simple plans.",
    tip: "Time words help you make plans without needing full grammar first.",
    items: [
      { title: "Today", english: "Today", target: "zare", script: "ዛሬ", note: "Use for something happening today.", example: "zare ehedalehu" },
      { title: "Tomorrow", english: "Tomorrow", target: "nege", script: "ነገ", note: "Use for future plans.", example: "nege enegenañ" },
      { title: "Morning", english: "Morning", target: "tuwat", script: "ጠዋት", note: "Useful for greetings and schedules.", example: "tuwat ehedalehu" },
      { title: "Evening", english: "Evening", target: "mishit", script: "ምሽት", note: "Use for evening plans.", example: "mishit enemetalehu" },
      { title: "Now", english: "Now", target: "ahun", script: "አሁን", note: "Use when something is immediate.", example: "ahun efeligalehu" },
    ],
  },
  {
    id: "am-travel",
    level: "Useful",
    title: "Travel And Transport",
    goal: "Use simple words for moving around.",
    tip: "Pair a place with ehedalehu to say where you are going.",
    items: [
      { title: "Bus", english: "Bus", target: "awtobus", script: "አውቶቡስ", note: "Useful for local transport.", example: "awtobus yet new?" },
      { title: "Taxi", english: "Taxi", target: "taxi", script: "ታክሲ", note: "Common city transport word.", example: "taxi efeligalehu" },
      { title: "Road", english: "Road", target: "menged", script: "መንገድ", note: "Use for road or way.", example: "mengedu yet new?" },
      { title: "I am going", english: "I am going", target: "ehedalehu", script: "እሄዳለሁ", note: "Useful for saying movement or plans.", example: "bet ehedalehu" },
      { title: "Stop here", english: "Stop here", target: "izi gar aqim", script: "እዚህ ጋር አቁም", note: "Useful in transport.", example: "izi gar aqim" },
    ],
  },
  {
    id: "am-health",
    level: "Advanced",
    title: "Health And Help",
    goal: "Explain simple needs and ask for help.",
    tip: "In urgent moments, short clear phrases are better than perfect grammar.",
    items: [
      { title: "I am sick", english: "I am sick", target: "tamimeyalehu", script: "ታምሜያለሁ", note: "Use when you feel unwell.", example: "zare tamimeyalehu" },
      { title: "Doctor", english: "Doctor", target: "hakim", script: "ሐኪም", note: "Useful in clinics and emergencies.", example: "hakim efeligalehu" },
      { title: "Medicine", english: "Medicine", target: "medhanit", script: "መድሃኒት", note: "Use when asking for medicine.", example: "medhanit efeligalehu" },
      { title: "Pain", english: "Pain", target: "himem", script: "ህመም", note: "Use to describe pain generally.", example: "himem ale" },
      { title: "Help me", english: "Help me", target: "irdañ", script: "እርዳኝ", note: "Direct and important phrase.", example: "ebakih, irdañ" },
    ],
  },
  {
    id: "am-school-work",
    level: "Advanced",
    title: "School And Work",
    goal: "Talk about learning, work, and simple tasks.",
    tip: "Use these to explain why you are learning or what you do.",
    items: [
      { title: "Student", english: "Student", target: "temari", script: "ተማሪ", note: "A learner or student.", example: "temari negn" },
      { title: "Teacher", english: "Teacher", target: "memhir", script: "መምህር", note: "A teacher.", example: "memhir new" },
      { title: "Book", english: "Book", target: "metsihaf", script: "መጽሐፍ", note: "Useful for school and study.", example: "metsihaf aleñ" },
      { title: "Work", english: "Work", target: "sira", script: "ስራ", note: "Job or work.", example: "sira aleñ" },
      { title: "I am studying", english: "I am studying", target: "etemaralehu", script: "እማራለሁ", note: "Use for school or self-study.", example: "amarinya etemaralehu" },
    ],
  },
  {
    id: "am-sentences",
    level: "Advanced",
    title: "Useful Short Sentences",
    goal: "Build short practical sentences.",
    tip: "Do not translate word-for-word; memorize useful whole phrases first.",
    items: [
      { title: "I do not understand", english: "I do not understand", target: "algebagnim", script: "አልገባኝም", note: "Use when you need repetition or help.", example: "yikirta, algebagnim" },
      { title: "Say it again", english: "Say it again", target: "degemew", script: "ደግመው", note: "A short way to ask for repetition.", example: "ebakih, degemew" },
      { title: "Slowly", english: "Slowly", target: "bekesita", script: "በቀስታ", note: "Ask someone to speak slowly.", example: "bekesita tenager" },
      { title: "I am learning Amharic", english: "I am learning Amharic", target: "amarinya etemaralehu", script: "አማርኛ እማራለሁ", note: "Helpful when practicing with speakers.", example: "amarinya etemaralehu" },
      { title: "Help me", english: "Help me", target: "irdañ", script: "እርዳኝ", note: "Use when asking for help.", example: "ebakih, irdañ" },
    ],
  },
];

const oromo: BiteLesson[] = [
  {
    id: "or-greetings",
    level: "Easy",
    title: "Greetings That Actually Start Conversations",
    goal: "Greet someone and answer back naturally.",
    tip: "Nagaa is a peaceful everyday greeting and a strong first word.",
    items: [
      { title: "Hello", english: "Hello", target: "nagaa", note: "A common greeting meaning peace.", example: "nagaa, akkam jirta?" },
      { title: "How are you?", english: "How are you?", target: "akkam jirta?", note: "Use to check on one person.", example: "akkam jirta?" },
      { title: "I am fine", english: "I am fine", target: "nagaan jira", note: "A simple positive reply.", example: "nagaan jira, galatoomaa" },
      { title: "Good morning", english: "Good morning", target: "akkam bulte", note: "Morning greeting.", example: "akkam bulte?" },
      { title: "Goodbye", english: "Goodbye", target: "nagaatti", note: "A common farewell.", example: "nagaatti" },
    ],
  },
  {
    id: "or-politeness",
    level: "Easy",
    title: "Polite Words",
    goal: "Make requests and replies more respectful.",
    tip: "Galatoomaa is one of the most useful words to master early.",
    items: [
      { title: "Thank you", english: "Thank you", target: "galatoomaa", note: "Use after help, food, directions, or service.", example: "galatoomaa" },
      { title: "Please", english: "Please", target: "maaloo", note: "Use to make a request polite.", example: "maaloo, na gargaari" },
      { title: "Sorry / excuse me", english: "Sorry", target: "dhiifama", note: "Use for apology or polite attention.", example: "dhiifama, eessa jira?" },
      { title: "Yes", english: "Yes", target: "eeyyee", note: "Simple yes.", example: "eeyyee, nan hubadha" },
      { title: "No", english: "No", target: "lakki", note: "Simple no.", example: "lakki, galatoomaa" },
    ],
  },
  {
    id: "or-numbers",
    level: "Building",
    title: "Numbers 1–10",
    goal: "Count and recognize small numbers.",
    tip: "Numbers help with prices, time, and ordering.",
    items: [
      { title: "One", english: "One", target: "tokko", note: "The number 1.", example: "buna tokko" },
      { title: "Two", english: "Two", target: "lama", note: "The number 2.", example: "buddeena lama" },
      { title: "Three", english: "Three", target: "sadii", note: "The number 3.", example: "sa'a sadii" },
      { title: "Five", english: "Five", target: "shan", note: "The number 5.", example: "birrii shan" },
      { title: "Ten", english: "Ten", target: "kudhan", note: "The number 10.", example: "birrii kudhan" },
    ],
  },
  {
    id: "or-family",
    level: "Building",
    title: "Family Words",
    goal: "Talk about close family members.",
    tip: "Family terms are useful when introducing yourself.",
    items: [
      { title: "Mother", english: "Mother", target: "haadha", note: "Your mother.", example: "haati koo nagaa dha" },
      { title: "Father", english: "Father", target: "abba", note: "Your father.", example: "abbaan koo barsiisaa dha" },
      { title: "Brother", english: "Brother", target: "obboleessa", note: "A brother.", example: "obboleessi koo barataa dha" },
      { title: "Sister", english: "Sister", target: "obboleettii", note: "A sister.", example: "obboleettiin koo mana jirti" },
      { title: "Family", english: "Family", target: "maatii", note: "Family as a group.", example: "maatiin koo nagaa dha" },
    ],
  },
  {
    id: "or-directions",
    level: "Useful",
    title: "Ask For Directions",
    goal: "Ask where something is and follow simple direction words.",
    tip: "Eessa jira is useful for places, objects, and people.",
    items: [
      { title: "Where is it?", english: "Where is it?", target: "eessa jira?", note: "Use for a place, person, or object.", example: "gabaan eessa jira?" },
      { title: "Left", english: "Left", target: "bitaa", note: "A basic direction word.", example: "gara bitaa" },
      { title: "Right", english: "Right", target: "mirga", note: "A basic direction word.", example: "gara mirgaa" },
      { title: "Near", english: "Near", target: "dhihoo", note: "Use when something is close.", example: "gabaan dhihoo dha" },
      { title: "Far", english: "Far", target: "fagoo", note: "Use when something is far away.", example: "mana barumsaa fagoo dha" },
    ],
  },
  {
    id: "or-market",
    level: "Useful",
    title: "Market Basics",
    goal: "Ask prices and buy simple items.",
    tip: "Meeqa is the key price word.",
    items: [
      { title: "How much is it?", english: "How much is it?", target: "meeqa?", note: "Use when asking price.", example: "bunni meeqa?" },
      { title: "I want", english: "I want", target: "nan barbaada", note: "Useful for buying or requesting.", example: "buna tokko nan barbaada" },
      { title: "Coffee", english: "Coffee", target: "buna", note: "Very common daily word.", example: "buna nan barbaada" },
      { title: "Bread", english: "Bread", target: "daabboo", note: "Useful in shops and restaurants.", example: "daabboo lama" },
      { title: "Water", english: "Water", target: "bishaan", note: "Essential travel word.", example: "bishaan nan barbaada" },
    ],
  },
  {
    id: "or-time-days",
    level: "Useful",
    title: "Time And Days",
    goal: "Talk about today, tomorrow, and simple plans.",
    tip: "Time words make your phrases immediately more useful.",
    items: [
      { title: "Today", english: "Today", target: "har'a", note: "Use for something happening today.", example: "har'a nan deema" },
      { title: "Tomorrow", english: "Tomorrow", target: "boru", note: "Use for future plans.", example: "boru wal argina" },
      { title: "Morning", english: "Morning", target: "ganama", note: "Useful for greetings and schedules.", example: "ganama nan deema" },
      { title: "Evening", english: "Evening", target: "galgala", note: "Use for evening plans.", example: "galgala nan dhufa" },
      { title: "Now", english: "Now", target: "amma", note: "Use when something is immediate.", example: "amma nan barbaada" },
    ],
  },
  {
    id: "or-travel",
    level: "Useful",
    title: "Travel And Transport",
    goal: "Use simple words for moving around.",
    tip: "Gara means toward/to and helps you talk about destinations.",
    items: [
      { title: "Bus", english: "Bus", target: "awtoobisii", note: "Useful for local transport.", example: "awtoobisii eessa jira?" },
      { title: "Taxi", english: "Taxi", target: "taaksii", note: "Common city transport word.", example: "taaksii nan barbaada" },
      { title: "Road", english: "Road", target: "karaa", note: "Use for road or way.", example: "karaan eessa jira?" },
      { title: "I am going", english: "I am going", target: "nan deema", note: "Useful for saying movement or plans.", example: "mana nan deema" },
      { title: "Stop here", english: "Stop here", target: "asitti dhaabi", note: "Useful in transport.", example: "maaloo, asitti dhaabi" },
    ],
  },
  {
    id: "or-health",
    level: "Advanced",
    title: "Health And Help",
    goal: "Explain simple needs and ask for help.",
    tip: "Short phrases are enough to get help quickly.",
    items: [
      { title: "I am sick", english: "I am sick", target: "nan dhukkubsadha", note: "Use when you feel unwell.", example: "har'a nan dhukkubsadha" },
      { title: "Doctor", english: "Doctor", target: "doktora", note: "Useful in clinics and emergencies.", example: "doktora nan barbaada" },
      { title: "Medicine", english: "Medicine", target: "qoricha", note: "Use when asking for medicine.", example: "qoricha nan barbaada" },
      { title: "Pain", english: "Pain", target: "dhukkuba", note: "Use to describe sickness or pain generally.", example: "dhukkuba qaba" },
      { title: "Help me", english: "Help me", target: "na gargaari", note: "Direct and important phrase.", example: "maaloo, na gargaari" },
    ],
  },
  {
    id: "or-school-work",
    level: "Advanced",
    title: "School And Work",
    goal: "Talk about learning, work, and simple tasks.",
    tip: "These are useful for introducing yourself and your daily life.",
    items: [
      { title: "Student", english: "Student", target: "barataa", note: "A learner or student.", example: "ani barataa dha" },
      { title: "Teacher", english: "Teacher", target: "barsiisaa", note: "A teacher.", example: "inni barsiisaa dha" },
      { title: "Book", english: "Book", target: "kitaaba", note: "Useful for school and study.", example: "kitaaba qaba" },
      { title: "Work", english: "Work", target: "hojii", note: "Job or work.", example: "hojii qaba" },
      { title: "I am studying", english: "I am studying", target: "nan baradha", note: "Use for school or self-study.", example: "afaan oromoo nan baradha" },
    ],
  },
  {
    id: "or-sentences",
    level: "Advanced",
    title: "Useful Short Sentences",
    goal: "Use practical whole phrases instead of isolated words.",
    tip: "Memorize these as complete phrases first.",
    items: [
      { title: "I do not understand", english: "I do not understand", target: "hin hubadhu", note: "Use when you need help or repetition.", example: "dhiifama, hin hubadhu" },
      { title: "Say it again", english: "Say it again", target: "irra deebi'i", note: "Ask someone to repeat.", example: "maaloo, irra deebi'i" },
      { title: "Slowly", english: "Slowly", target: "suuta", note: "Ask someone to speak slowly.", example: "suuta dubbadhu" },
      { title: "I am learning Afan Oromoo", english: "I am learning Afan Oromoo", target: "afaan oromoo barachaan jira", note: "Helpful when practicing with speakers.", example: "afaan oromoo barachaan jira" },
      { title: "Help me", english: "Help me", target: "na gargaari", note: "Use when asking for help.", example: "maaloo, na gargaari" },
    ],
  },
];

const tigrinya: BiteLesson[] = [
  {
    id: "ti-greetings",
    level: "Easy",
    title: "Greetings That Actually Start Conversations",
    goal: "Greet someone and answer back naturally.",
    tip: "Selam is simple, useful, and understood in many contexts.",
    items: [
      { title: "Hello", english: "Hello", target: "selam", script: "ሰላም", note: "A common greeting for everyday use.", example: "selam, kemey aleka?" },
      { title: "How are you?", english: "How are you?", target: "kemey aleka?", script: "ከመይ ኣለኻ?", note: "Use when speaking to one male friend.", example: "kemey aleka?" },
      { title: "I am fine", english: "I am fine", target: "dehan aloku", script: "ደሓን ኣለኹ", note: "A natural short answer after a greeting.", example: "dehan aloku, yekenyeley" },
      { title: "Good morning", english: "Good morning", target: "dehan hadirka", script: "ደሓን ሓዲርካ", note: "Morning greeting to one male person.", example: "dehan hadirka" },
      { title: "Goodbye", english: "Goodbye", target: "dehan kun", script: "ደሓን ኩን", note: "Friendly farewell.", example: "dehan kun" },
    ],
  },
  {
    id: "ti-politeness",
    level: "Easy",
    title: "Polite Words",
    goal: "Sound respectful in short everyday exchanges.",
    tip: "Use these often; they make your speech warmer.",
    items: [
      { title: "Thank you", english: "Thank you", target: "yekenyeley", script: "የቐንየለይ", note: "Use after receiving help or kindness.", example: "yekenyeley" },
      { title: "Please", english: "Please", target: "bjaaka", script: "ብጃኻ", note: "Use with requests.", example: "bjaaka, hadegni" },
      { title: "Sorry / excuse me", english: "Sorry", target: "yikirta", script: "ይቕረታ", note: "Useful for apology or polite attention.", example: "yikirta, abey alo?" },
      { title: "Yes", english: "Yes", target: "ee", script: "እወ", note: "Simple yes.", example: "ee, terediuni" },
      { title: "No", english: "No", target: "aykonen", script: "ኣይኮነን", note: "Simple no / it is not.", example: "aykonen, yekenyeley" },
    ],
  },
  {
    id: "ti-numbers",
    level: "Building",
    title: "Numbers 1–10",
    goal: "Count and recognize small numbers.",
    tip: "Numbers help with prices, time, addresses, and ordering.",
    items: [
      { title: "One", english: "One", target: "hade", script: "ሓደ", note: "The number 1.", example: "hade buna" },
      { title: "Two", english: "Two", target: "kilte", script: "ክልተ", note: "The number 2.", example: "kilte injera" },
      { title: "Three", english: "Three", target: "seleste", script: "ሰለስተ", note: "The number 3.", example: "seleste sa'at" },
      { title: "Five", english: "Five", target: "hamushte", script: "ሓሙሽተ", note: "The number 5.", example: "hamushte birr" },
      { title: "Ten", english: "Ten", target: "aserte", script: "ዓሰርተ", note: "The number 10.", example: "aserte birr" },
    ],
  },
  {
    id: "ti-family",
    level: "Building",
    title: "Family Words",
    goal: "Talk about close family members.",
    tip: "Family words are useful in introductions and daily talk.",
    items: [
      { title: "Mother", english: "Mother", target: "ade", script: "ኣደ", note: "Your mother.", example: "adey dehan iya" },
      { title: "Father", english: "Father", target: "ab", script: "ኣቦ", note: "Your father.", example: "aboy memhir iyu" },
      { title: "Brother", english: "Brother", target: "haw", script: "ሓው", note: "A brother.", example: "hawey temhari iyu" },
      { title: "Sister", english: "Sister", target: "hafti", script: "ሓፍቲ", note: "A sister.", example: "haftiy geza ala" },
      { title: "Family", english: "Family", target: "seb", script: "ስብ", note: "People/family depending on context.", example: "sebay dehan iyu" },
    ],
  },
  {
    id: "ti-directions",
    level: "Useful",
    title: "Ask For Directions",
    goal: "Ask where something is and understand simple directions.",
    tip: "Abey alo is practical when navigating.",
    items: [
      { title: "Where is it?", english: "Where is it?", target: "abey alo?", script: "ኣበይ ኣሎ?", note: "Use for a place, object, or destination.", example: "suuq abey alo?" },
      { title: "Left", english: "Left", target: "tsegam", script: "ጸጋም", note: "A basic direction word.", example: "nab tsegam" },
      { title: "Right", english: "Right", target: "yeman", script: "የማን", note: "A basic direction word.", example: "nab yeman" },
      { title: "Near", english: "Near", target: "qeribu", script: "ቀረባ", note: "Use when something is close.", example: "suuq qeribu iyu" },
      { title: "Far", english: "Far", target: "rihuq", script: "ርሑቕ", note: "Use when something is far away.", example: "geza rihuq iyu" },
    ],
  },
  {
    id: "ti-market",
    level: "Useful",
    title: "Market Basics",
    goal: "Ask prices and buy simple items.",
    tip: "Use kendey iyu when asking prices.",
    items: [
      { title: "How much is it?", english: "How much is it?", target: "kendey iyu?", script: "ክንደይ እዩ?", note: "Use when asking price.", example: "buna kendey iyu?" },
      { title: "I want", english: "I want", target: "yedeliyo", script: "ይደልዮ", note: "Useful for buying or requesting.", example: "hade buna yedeliyo" },
      { title: "Coffee", english: "Coffee", target: "buna", script: "ቡና", note: "Very common daily word.", example: "buna yedeliyo" },
      { title: "Bread", english: "Bread", target: "himbasha", script: "ሕምባሻ", note: "Useful in shops and restaurants.", example: "kilte himbasha" },
      { title: "Water", english: "Water", target: "mai", script: "ማይ", note: "Essential travel word.", example: "mai yedeliyo" },
    ],
  },
  {
    id: "ti-time-days",
    level: "Useful",
    title: "Time And Days",
    goal: "Talk about today, tomorrow, and simple plans.",
    tip: "Time words make even short phrases more useful.",
    items: [
      { title: "Today", english: "Today", target: "leomi", script: "ሎሚ", note: "Use for something happening today.", example: "leomi keyde aleku" },
      { title: "Tomorrow", english: "Tomorrow", target: "tsibah", script: "ጽባሕ", note: "Use for future plans.", example: "tsibah nraakeb" },
      { title: "Morning", english: "Morning", target: "nigho", script: "ንግሆ", note: "Useful for greetings and schedules.", example: "nigho keyde aleku" },
      { title: "Evening", english: "Evening", target: "mishi", script: "ምሸት", note: "Use for evening plans.", example: "mishi kemetsie eye" },
      { title: "Now", english: "Now", target: "hitsi", script: "ሕጂ", note: "Use when something is immediate.", example: "hitsi yedeliyo" },
    ],
  },
  {
    id: "ti-travel",
    level: "Useful",
    title: "Travel And Transport",
    goal: "Use simple words for moving around.",
    tip: "Nab means to/toward and helps you talk about destinations.",
    items: [
      { title: "Bus", english: "Bus", target: "awtobus", script: "ኣውቶቡስ", note: "Useful for local transport.", example: "awtobus abey alo?" },
      { title: "Taxi", english: "Taxi", target: "taksi", script: "ታክሲ", note: "Common city transport word.", example: "taksi yedeliyo" },
      { title: "Road", english: "Road", target: "mengedi", script: "መንገዲ", note: "Use for road or way.", example: "mengedi abey alo?" },
      { title: "I am going", english: "I am going", target: "keyde aleku", script: "ከይደ ኣለኹ", note: "Useful for saying movement or plans.", example: "nab geza keyde aleku" },
      { title: "Stop here", english: "Stop here", target: "abzi aqim", script: "ኣብዚ ኣቁም", note: "Useful in transport.", example: "bjaaka, abzi aqim" },
    ],
  },
  {
    id: "ti-health",
    level: "Advanced",
    title: "Health And Help",
    goal: "Explain simple needs and ask for help.",
    tip: "In urgent moments, short clear phrases work best.",
    items: [
      { title: "I am sick", english: "I am sick", target: "hamime aleku", script: "ሓሚመ ኣለኹ", note: "Use when you feel unwell.", example: "leomi hamime aleku" },
      { title: "Doctor", english: "Doctor", target: "doktor", script: "ዶክተር", note: "Useful in clinics and emergencies.", example: "doktor yedeliyo" },
      { title: "Medicine", english: "Medicine", target: "medhanit", script: "መድሓኒት", note: "Use when asking for medicine.", example: "medhanit yedeliyo" },
      { title: "Pain", english: "Pain", target: "himam", script: "ሕማም", note: "Use to describe sickness or pain generally.", example: "himam aleku" },
      { title: "Help me", english: "Help me", target: "hadegni", script: "ሓግዘኒ", note: "Direct and important phrase.", example: "bjaaka, hadegni" },
    ],
  },
  {
    id: "ti-school-work",
    level: "Advanced",
    title: "School And Work",
    goal: "Talk about learning, work, and simple tasks.",
    tip: "These help you explain who you are and what you do.",
    items: [
      { title: "Student", english: "Student", target: "temhari", script: "ተምሃራይ", note: "A learner or student.", example: "ane temhari eye" },
      { title: "Teacher", english: "Teacher", target: "memhir", script: "መምህር", note: "A teacher.", example: "nisu memhir iyu" },
      { title: "Book", english: "Book", target: "metsihaf", script: "መጽሓፍ", note: "Useful for school and study.", example: "metsihaf aleyni" },
      { title: "Work", english: "Work", target: "sira", script: "ስራሕ", note: "Job or work.", example: "sira aleyni" },
      { title: "I am studying", english: "I am studying", target: "ytemahar aleku", script: "ይመሃር ኣለኹ", note: "Use for school or self-study.", example: "tigrinya ytemahar aleku" },
    ],
  },
  {
    id: "ti-sentences",
    level: "Advanced",
    title: "Useful Short Sentences",
    goal: "Use practical whole phrases instead of isolated words.",
    tip: "Memorize these as complete phrases first.",
    items: [
      { title: "I do not understand", english: "I do not understand", target: "ayteredeanin", script: "ኣይተረደኣንን", note: "Use when you need help or repetition.", example: "yikirta, ayteredeanin" },
      { title: "Say it again", english: "Say it again", target: "degimka bela", script: "ደጊምካ በላ", note: "Ask someone to repeat.", example: "bjaaka, degimka bela" },
      { title: "Slowly", english: "Slowly", target: "beqeshta", script: "ብቐስታ", note: "Ask someone to speak slowly.", example: "beqeshta tezareb" },
      { title: "I am learning Tigrinya", english: "I am learning Tigrinya", target: "tigrinya ytemahar aleku", script: "ትግርኛ ይመሃር ኣለኹ", note: "Helpful when practicing with speakers.", example: "tigrinya ytemahar aleku" },
      { title: "Help me", english: "Help me", target: "hadegni", script: "ሓግዘኒ", note: "Use when asking for help.", example: "bjaaka, hadegni" },
    ],
  },
];

export const biteLessons: Record<BiteLanguage, BiteLesson[]> = {
  amharic,
  oromo,
  tigrinya,
};
