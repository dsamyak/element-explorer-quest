import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { elements, categoryLabels, categoryColors, type Element, type ElementCategory } from "@/data/elements";
import ElementTile from "./ElementTile";
import { X, Atom, Zap, Beaker } from "lucide-react";

import { ElementDetailModal } from "./ElementDetailModal";

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
          {elements.map((el, index) => {
            const pos = getGridPosition(el);
            if (!pos) return null;
            return (
              <motion.div
                key={el.number}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.005, duration: 0.3 }}
                style={{ gridColumn: pos.col, gridRow: pos.row }}
              >
                <ElementTile
                  element={el}
                  onClick={setSelectedElement}
                  highlighted={filterCategory === el.category}
                  dimmed={filterCategory !== null && filterCategory !== el.category}
                  size="md"
                />
              </motion.div>
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

      <ElementDetailModal selectedElement={selectedElement} onClose={() => setSelectedElement(null)} />
    </div>
  );
};

export default PeriodicTable;
