import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Atom, Zap, Beaker } from "lucide-react";
import { categoryLabels, type Element } from "@/data/elements";
import { AnimatedAtom } from "./AnimatedAtom";

interface ElementDetailModalProps {
  selectedElement: Element | null;
  onClose: () => void;
}

export const ElementDetailModal = ({ selectedElement, onClose }: ElementDetailModalProps) => {
  return (
    <AnimatePresence>
      {selectedElement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full relative glow-primary"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4">
              <AnimatedAtom category={selectedElement.category} symbol={selectedElement.symbol} />
              <div className="flex-1">
                <h2 className="text-xl font-display text-foreground">{selectedElement.name}</h2>
                <p className="text-sm text-muted-foreground">{categoryLabels[selectedElement.category]}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <InfoCard icon={<Atom size={14} />} label="Atomic Mass" value={selectedElement.mass} />
              <InfoCard icon={<Zap size={14} />} label="Electron Config" value={selectedElement.electron_config} />
              <InfoCard icon={<Beaker size={14} />} label="Period" value={String(selectedElement.period)} />
              <InfoCard icon={<Beaker size={14} />} label="Group" value={String(selectedElement.group)} />
            </div>

            <div className="mt-4 p-3 rounded-md bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground font-medium mb-1">💡 Fun Fact</p>
              <p className="text-sm text-foreground">{selectedElement.fun_fact}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoCard = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className="p-2 rounded bg-muted/20 border border-border/50">
    <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
      {icon}
      <span className="text-[10px]">{label}</span>
    </div>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);
