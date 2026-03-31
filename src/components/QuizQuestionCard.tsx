import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  prompt: string;
  correctAnswer: string;
  options: string[];
}

interface QuizQuestionCardProps {
  question: Question;
  selected: string | null;
  isCorrect: boolean | null;
  streak: number;
  handleAnswer: (answer: string) => void;
  nextQuestion: () => void;
}

export const QuizQuestionCard = ({
  question,
  selected,
  isCorrect,
  streak,
  handleAnswer,
  nextQuestion,
}: QuizQuestionCardProps) => {
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.prompt}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="w-full"
        >
          <div className="text-center mb-5">
            <p className="text-lg font-medium text-foreground">{question.prompt}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              let extra = "";
              if (selected) {
                if (opt === question.correctAnswer) {
                  extra = "border-green-500 bg-green-500/10 glow-success";
                } else if (opt === selected && !isCorrect) {
                  extra = "border-destructive bg-destructive/10 glow-danger";
                }
              }
              return (
                <motion.div
                  key={opt}
                  whileHover={!selected ? { scale: 1.03 } : {}}
                  whileTap={!selected ? { scale: 0.97 } : {}}
                >
                  <button
                    disabled={!!selected}
                    onClick={() => handleAnswer(opt)}
                    className={`
                      w-full py-3 px-4 rounded-lg border border-border text-sm font-medium
                      transition-all bg-card hover:bg-muted/50 text-foreground
                      disabled:cursor-default shadow-sm
                      ${extra}
                    `}
                  >
                    {opt}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center space-y-3 mt-6"
          >
            {isCorrect ? (
              <p className="text-green-400 font-display text-sm">
                ✓ Correct! +{10 + Math.floor((streak - 1) / 3) * 5} pts
              </p>
            ) : (
              <p className="text-destructive font-display text-sm">
                ✗ The answer was: {question.correctAnswer}
              </p>
            )}
            <Button onClick={nextQuestion} className="gap-2" size="sm">
              Next <ArrowRight size={14} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
