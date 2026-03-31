import { useState, useCallback, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { elements, categoryLabels } from "@/data/elements";
import type { Element } from "@/data/elements";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Heart, RotateCcw, Sparkles, Star, Zap } from "lucide-react";
import { playCorrectSound, playWrongSound, playLevelUpSound } from "@/lib/audio";
import { QuizQuestionCard } from "./QuizQuestionCard";

export type QuestionType = "symbol-to-name" | "name-to-symbol" | "number-to-name" | "category-quiz" | "fact-quiz" | "group-guess" | "period-guess" | "mass-guess";

export interface Question {
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options: string[];
  element: Element;
}

const QUESTION_TYPES: QuestionType[] = ["symbol-to-name", "name-to-symbol", "number-to-name", "category-quiz", "fact-quiz", "group-guess", "period-guess", "mass-guess"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(): Question {
  const type = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
  const el = elements[Math.floor(Math.random() * elements.length)];
  const others = shuffle(elements.filter((e) => e.number !== el.number));

  switch (type) {
    case "symbol-to-name": {
      const options = shuffle([el.name, ...others.slice(0, 3).map((e) => e.name)]);
      return { type, prompt: `What element has the symbol "${el.symbol}"?`, correctAnswer: el.name, options, element: el };
    }
    case "name-to-symbol": {
      const options = shuffle([el.symbol, ...others.slice(0, 3).map((e) => e.symbol)]);
      return { type, prompt: `What is the symbol for ${el.name}?`, correctAnswer: el.symbol, options, element: el };
    }
    case "number-to-name": {
      const options = shuffle([el.name, ...others.slice(0, 3).map((e) => e.name)]);
      return { type, prompt: `Which element has atomic number ${el.number}?`, correctAnswer: el.name, options, element: el };
    }
    case "category-quiz": {
      const catLabel = categoryLabels[el.category];
      const otherCats = shuffle(
        Object.values(categoryLabels).filter((c) => c !== catLabel)
      ).slice(0, 3);
      const options = shuffle([catLabel, ...otherCats]);
      return { type, prompt: `What category does ${el.name} (${el.symbol}) belong to?`, correctAnswer: catLabel, options, element: el };
    }
    case "fact-quiz": {
      const options = shuffle([el.name, ...others.slice(0, 3).map((e) => e.name)]);
      return { type, prompt: `Which element: "${el.fun_fact}"?`, correctAnswer: el.name, options, element: el };
    }
    case "group-guess": {
      const validOthers = others.filter(o => o.group !== el.group);
      const options = shuffle([el.name, ...validOthers.slice(0, 3).map((e) => e.name)]);
      return { type, prompt: `Which of these elements is in Group ${el.group}?`, correctAnswer: el.name, options, element: el };
    }
    case "period-guess": {
      const validOthers = others.filter(o => o.period !== el.period);
      const options = shuffle([el.name, ...validOthers.slice(0, 3).map((e) => e.name)]);
      return { type, prompt: `Which element is found in Period ${el.period}?`, correctAnswer: el.name, options, element: el };
    }
    case "mass-guess": {
      const options = shuffle([el.name, ...others.slice(0, 3).map((e) => e.name)]);
      return { type, prompt: `Which element has an atomic mass of ${el.mass}?`, correctAnswer: el.name, options, element: el };
    }
  }
}

type Difficulty = "easy" | "medium" | "hard";

const difficultyConfig: Record<Difficulty, { lives: number; timePerQ: number; label: string; color: string }> = {
  easy: { lives: 5, timePerQ: 0, label: "Explorer", color: "text-green-400" },
  medium: { lives: 3, timePerQ: 15, label: "Scientist", color: "text-yellow-400" },
  hard: { lives: 1, timePerQ: 8, label: "Nobel Laureate", color: "text-red-400" },
};

const ElementQuiz = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [xp, setXp] = useState(0);
  const [timer, setTimer] = useState(0);
  const [level, setLevel] = useState(1);

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(difficultyConfig[diff].lives);
    setQuestionCount(0);
    setGameOver(false);
    setXp(0);
    setLevel(1);
    setSelected(null);
    setIsCorrect(null);
    setQuestion(generateQuestion());
    setTimer(difficultyConfig[diff].timePerQ);
  }, []);

  // Timer
  useEffect(() => {
    if (!difficulty || !question || selected || gameOver) return;
    const conf = difficultyConfig[difficulty];
    if (conf.timePerQ === 0) return;
    if (timer <= 0) {
      handleAnswer("__timeout__");
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, question, selected, difficulty, gameOver]);

  const handleAnswer = (answer: string) => {
    if (selected || !question || !difficulty) return;
    setSelected(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    setQuestionCount((c) => c + 1);

    if (correct) {
      playCorrectSound();
      const streakBonus = Math.floor(streak / 3) * 5;
      const points = 10 + streakBonus;
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      const newStreak = streak + 1;
      if (newStreak > bestStreak) setBestStreak(newStreak);
      const newXp = xp + points;
      setXp(newXp);
      const newLevel = Math.floor(newXp / 50) + 1;
      if (newLevel > level) {
        setTimeout(playLevelUpSound, 500);
      }
      setLevel(newLevel);
    } else {
      playWrongSound();
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  };

  const nextQuestion = () => {
    if (gameOver) return;
    setSelected(null);
    setIsCorrect(null);
    setQuestion(generateQuestion());
    if (difficulty) setTimer(difficultyConfig[difficulty].timePerQ);
  };

  // Difficulty selection
  if (!difficulty) {
    return (
      <div className="flex flex-col items-center gap-6 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-display text-foreground text-glow mb-2">Element Quiz</h2>
          <p className="text-muted-foreground">Choose your difficulty level</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
            const conf = difficultyConfig[d];
            return (
              <motion.button
                key={d}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame(d)}
                className="p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-all flex flex-col items-center gap-2"
              >
                <span className={`text-lg font-display ${conf.color}`}>{conf.label}</span>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  {Array.from({ length: conf.lives }).map((_, i) => (
                    <Heart key={i} size={12} className="fill-current" />
                  ))}
                </div>
                {conf.timePerQ > 0 && (
                  <span className="text-xs text-muted-foreground">{conf.timePerQ}s per question</span>
                )}
                {conf.timePerQ === 0 && (
                  <span className="text-xs text-muted-foreground">No time limit</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Game Over
  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-10"
      >
        <Trophy className="text-accent" size={48} />
        <h2 className="text-3xl font-display text-foreground text-glow">Game Over!</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          <StatCard label="Score" value={score} icon={<Star size={16} />} />
          <StatCard label="Questions" value={questionCount} icon={<Zap size={16} />} />
          <StatCard label="Best Streak" value={bestStreak} icon={<Flame size={16} />} />
          <StatCard label="Level" value={level} icon={<Sparkles size={16} />} />
        </div>
        <div className="flex gap-3">
          <Button onClick={() => startGame(difficulty)} className="gap-2">
            <RotateCcw size={16} /> Play Again
          </Button>
          <Button variant="outline" onClick={() => setDifficulty(null)}>
            Change Difficulty
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!question) return null;
  const conf = difficultyConfig[difficulty];

  return (
    <div className="flex flex-col items-center gap-4 py-6 max-w-xl mx-auto">
      {/* Stats Bar */}
      <div className="flex items-center justify-between w-full gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-accent">
            <Star size={14} />
            <span className="text-sm font-display">{score}</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Flame size={14} />
            <span className="text-sm font-display">{streak}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-display">
          Lv.{level} <span className="text-foreground/40">|</span> Q{questionCount + 1}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: conf.lives }).map((_, i) => (
            <Heart
              key={i}
              size={14}
              className={i < lives ? "text-destructive fill-destructive" : "text-muted-foreground/30"}
            />
          ))}
        </div>
      </div>

      {/* Timer */}
      {conf.timePerQ > 0 && (
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "100%" }}
            animate={{ width: `${(timer / conf.timePerQ) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* XP Bar */}
      <div className="w-full">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
          <span>XP: {xp % 50}/50</span>
          <span>Level {level}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-secondary transition-all" style={{ width: `${((xp % 50) / 50) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <QuizQuestionCard
        question={question}
        selected={selected}
        isCorrect={isCorrect}
        streak={streak}
        handleAnswer={handleAnswer}
        nextQuestion={nextQuestion}
      />
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: number; icon: ReactNode }) => (
  <div className="p-3 rounded-lg bg-card border border-border">
    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">{icon}<span className="text-xs">{label}</span></div>
    <span className="text-2xl font-display text-foreground">{value}</span>
  </div>
);

export default ElementQuiz;
