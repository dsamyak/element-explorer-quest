import { motion } from "framer-motion";
import type { ElementCategory } from "@/data/elements";

interface AnimatedAtomProps {
  category: ElementCategory;
  symbol: string;
}

export const AnimatedAtom = ({ category, symbol }: AnimatedAtomProps) => {
  return (
    <div className={`relative w-24 h-24 flex items-center justify-center text-element-${category}`}>
      {/* Spinning Electron Orbits */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute w-[140%] h-[140%] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40" />
        <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40" transform="rotate(120 50 50)" />
        
        {/* Electrons (little dots on the orbits) */}
        <circle cx="95" cy="50" r="2.5" fill="currentColor" />
        <circle cx="95" cy="50" r="2.5" fill="currentColor" transform="rotate(60 50 50)" />
        <circle cx="95" cy="50" r="2.5" fill="currentColor" transform="rotate(120 50 50)" />
      </motion.svg>

      {/* Pulsing Nucleus */}
      <motion.div
        className={`relative z-10 w-12 h-12 rounded-full border border-element-${category}/50 bg-background flex flex-col items-center justify-center`}
        animate={{ boxShadow: ["0 0 10px currentColor", "0 0 25px currentColor", "0 0 10px currentColor"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-sm" />
        <span className="text-xl font-bold font-display relative z-20 text-foreground text-glow">{symbol}</span>
      </motion.div>
    </div>
  );
};
