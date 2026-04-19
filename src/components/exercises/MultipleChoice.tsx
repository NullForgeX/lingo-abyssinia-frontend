import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Exercise } from '@/data/courseContent';

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

const MultipleChoice = ({ exercise, onAnswer }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

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

      <div className="grid gap-3">
        {exercise.options?.map((option, idx) => {
          const isCorrect = option === exercise.correctAnswer;
          const isSelected = option === selected;
          let style = 'border-border bg-card hover:border-primary/50 hover:bg-primary/5';
          if (answered && isSelected && isCorrect) {
            style = 'border-primary bg-primary/10';
          } else if (answered && isSelected && !isCorrect) {
            style = 'border-destructive bg-destructive/10';
          } else if (answered && isCorrect) {
            style = 'border-primary/40 bg-primary/5';
          }

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
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                {String.fromCharCode(65 + idx)}
              </span>
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

export default MultipleChoice;
