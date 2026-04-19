import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { Exercise } from '@/data/courseContent';

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

const AudioExercise = ({ exercise, onAnswer }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (!exercise.audioText || speaking) return;
    setSpeaking(true);

    // Use Web Speech API for pronunciation
    const utterance = new SpeechSynthesisUtterance(exercise.audioText);
    utterance.rate = 0.8;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    // Try to find an Amharic voice, fall back to default
    const voices = speechSynthesis.getVoices();
    const amharicVoice = voices.find(v => v.lang.startsWith('am'));
    if (amharicVoice) utterance.voice = amharicVoice;

    speechSynthesis.speak(utterance);
  }, [exercise.audioText, speaking]);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option === exercise.correctAnswer;
    setTimeout(() => onAnswer(correct), 800);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
        {exercise.question}
      </h2>

      {/* Audio playback button */}
      <motion.button
        onClick={speak}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 transition-colors ${
          speaking
            ? 'border-secondary bg-secondary/20 animate-pulse'
            : 'border-primary bg-primary/10 hover:bg-primary/20'
        }`}
      >
        <Volume2 className={`h-10 w-10 ${speaking ? 'text-secondary' : 'text-primary'}`} />
      </motion.button>

      {exercise.audioText && (
        <p className="text-center text-lg font-medium text-muted-foreground" style={{ fontFamily: 'serif' }}>
          {exercise.audioText}
        </p>
      )}

      {/* Options */}
      <div className="grid gap-3">
        {exercise.options?.map((option, idx) => {
          const isCorrect = option === exercise.correctAnswer;
          const isSelected = option === selected;
          let style = 'border-border bg-card hover:border-primary/50';
          if (answered && isSelected && isCorrect) style = 'border-primary bg-primary/10';
          else if (answered && isSelected && !isCorrect) style = 'border-destructive bg-destructive/10';
          else if (answered && isCorrect) style = 'border-primary/40 bg-primary/5';

          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${style} ${
                answered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="flex-1 font-medium text-foreground">{option}</span>
              {answered && isSelected && isCorrect && <CheckCircle2 className="h-5 w-5 text-primary" />}
              {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AudioExercise;
