import { useState } from "react";
import { motion } from "framer-motion";
import { Atom, Gamepad2, BookOpen } from "lucide-react";
import PeriodicTable from "@/components/PeriodicTable";
import ElementQuiz from "@/components/ElementQuiz";

type Mode = "explore" | "quiz";

const Index = () => {
  const [mode, setMode] = useState<Mode>("explore");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Atom className="text-primary" size={24} />
            <h1 className="text-lg font-display text-foreground text-glow tracking-wider">
              ELEMENTUM
            </h1>
          </div>
          <nav className="flex gap-1">
            <TabButton active={mode === "explore"} onClick={() => setMode("explore")} icon={<BookOpen size={14} />} label="Explore" />
            <TabButton active={mode === "quiz"} onClick={() => setMode("quiz")} icon={<Gamepad2 size={14} />} label="Quiz" />
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {mode === "explore" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-6">
              <h2 className="text-xl font-display text-foreground/90 mb-1">Interactive Periodic Table</h2>
              <p className="text-sm text-muted-foreground">Click any element to learn more. Filter by category.</p>
            </div>
            <PeriodicTable />
          </motion.div>
        )}
        {mode === "quiz" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ElementQuiz />
          </motion.div>
        )}
      </main>
    </div>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
      ${active ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
    `}
  >
    {icon} {label}
  </button>
);

export default Index;
