import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Exercise } from '@/data/courseContent';
import { Button } from '@/components/ui/button';

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

const TranslationExercise = ({ exercise, onAnswer }: Props) => {
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (answered || !input.trim()) return;
    const normalize = (value: string) => value.trim().toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ");
    const accepted = [exercise.correctAnswer, ...(exercise.acceptedAnswers || [])].map(normalize);
    const correct = accepted.includes(normalize(input));
    setIsCorrect(correct);
    setAnswered(true);
    setTimeout(() => onAnswer(correct), 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
        {exercise.question}
      </h2>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => !answered && setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type your translation..."
            disabled={answered}
            className={`w-full rounded-xl border-2 bg-card px-4 py-4 text-lg font-medium text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
              answered
                ? isCorrect
                  ? 'border-primary bg-primary/5'
                  : 'border-destructive bg-destructive/5'
                : 'border-border focus:border-primary'
            }`}
          />
          {answered && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <XCircle className="h-6 w-6 text-destructive" />
              )}
            </div>
          )}
        </motion.div>

        {answered && !isCorrect && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            Correct answer: <span className="font-semibold text-primary">{exercise.correctAnswer}</span>
          </motion.p>
        )}

        {!answered && (
          <Button onClick={handleSubmit} disabled={!input.trim()} className="w-full gap-2" size="lg">
            Check <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TranslationExercise;

