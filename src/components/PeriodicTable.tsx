import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { elements, categoryLabels, categoryColors, type Element, type ElementCategory } from "@/data/elements";
import ElementTile from "./ElementTile";
import { X, Atom, Zap, Beaker } from "lucide-react";

// Build grid: 18 columns, 7 rows + 2 for lanthanides/actinides
const getGridPosition = (el: Element): { col: number; row: number } | null => {
  // Lanthanides: row 9, col based on atomic number
  if (el.category === "lanthanide") {
    return { col: el.number - 57 + 3, row: 9 };
  }
  // Actinides: row 10
  if (el.category === "actinide") {
    return { col: el.number - 89 + 3, row: 10 };
  }
  return { col: el.group, row: el.period };
};

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [filterCategory, setFilterCategory] = useState<ElementCategory | null>(null);

  return (
    <div className="w-full">
      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {(Object.keys(categoryLabels) as ElementCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded text-xs font-body transition-all
              border border-border/50
              ${filterCategory === cat ? "ring-1 ring-primary bg-muted" : "bg-card/40 hover:bg-card/80"}
            `}
          >
            <span className={`w-2.5 h-2.5 rounded-sm ${categoryColors[cat]}`} />
            <span className="text-foreground/80">{categoryLabels[cat]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-[2px] mx-auto"
          style={{
            gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
            gridTemplateRows: "repeat(10, auto)",
            width: "fit-content",
            minWidth: "900px",
          }}
        >
          {elements.map((el) => {
            const pos = getGridPosition(el);
            if (!pos) return null;
            return (
              <div
                key={el.number}
                style={{ gridColumn: pos.col, gridRow: pos.row }}
              >
                <ElementTile
                  element={el}
                  onClick={setSelectedElement}
                  highlighted={filterCategory === el.category}
                  dimmed={filterCategory !== null && filterCategory !== el.category}
                  size="md"
                />
              </div>
            );
          })}
          {/* Labels for lanthanide/actinide rows */}
          <div style={{ gridColumn: 1, gridRow: 9 }} className="flex items-center justify-end pr-1">
            <span className="text-[8px] text-element-lanthanide font-display">La-Lu</span>
          </div>
          <div style={{ gridColumn: 1, gridRow: 10 }} className="flex items-center justify-end pr-1">
            <span className="text-[8px] text-element-actinide font-display">Ac-Lr</span>
          </div>
        </div>
      </div>

      {/* Element Detail Modal */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
            onClick={() => setSelectedElement(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full relative glow-primary"
            >
              <button
                onClick={() => setSelectedElement(null)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>

              <div className="flex items-start gap-4">
                <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 ${
                  `border-element-${selectedElement.category}`
                } bg-muted/30`}>
                  <span className="text-xs text-muted-foreground">{selectedElement.number}</span>
                  <span className={`text-3xl font-bold text-element-${selectedElement.category}`}>
                    {selectedElement.symbol}
                  </span>
                </div>
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
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="p-2 rounded bg-muted/20 border border-border/50">
    <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
      {icon}
      <span className="text-[10px]">{label}</span>
    </div>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default PeriodicTable;
