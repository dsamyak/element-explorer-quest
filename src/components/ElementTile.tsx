import { type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Element, ElementCategory } from "@/data/elements";
import { playHoverSound, playClickSound } from "@/lib/audio";

const categoryBorderColors: Record<ElementCategory, string> = {
  alkali: "border-element-alkali",
  alkaline: "border-element-alkaline",
  transition: "border-element-transition",
  "post-transition": "border-element-post-transition",
  metalloid: "border-element-metalloid",
  nonmetal: "border-element-nonmetal",
  halogen: "border-element-halogen",
  noble: "border-element-noble",
  lanthanide: "border-element-lanthanide",
  actinide: "border-element-actinide",
};

const categoryTextColors: Record<ElementCategory, string> = {
  alkali: "text-element-alkali",
  alkaline: "text-element-alkaline",
  transition: "text-element-transition",
  "post-transition": "text-element-post-transition",
  metalloid: "text-element-metalloid",
  nonmetal: "text-element-nonmetal",
  halogen: "text-element-halogen",
  noble: "text-element-noble",
  lanthanide: "text-element-lanthanide",
  actinide: "text-element-actinide",
};

interface ElementTileProps {
  element: Element;
  onClick?: (element: Element) => void;
  highlighted?: boolean;
  dimmed?: boolean;
  size?: "sm" | "md";
}

const ElementTile = ({ element, onClick, highlighted, dimmed, size = "md" }: ElementTileProps) => {
  const isSm = size === "sm";

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17deg", "-17deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17deg", "17deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    playHoverSound();
  };

  const handleClick = () => {
    playClickSound();
    onClick?.(element);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.15, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        relative flex flex-col items-center justify-center
        border rounded-sm cursor-pointer transition-all duration-200
        ${categoryBorderColors[element.category]}
        ${dimmed ? "opacity-20" : "opacity-100"}
        ${highlighted ? "ring-2 ring-primary glow-primary" : ""}
        ${isSm ? "w-7 h-8 p-0" : "w-[3.2rem] h-[3.6rem] p-0.5"}
        bg-card/60 backdrop-blur-sm hover:bg-card
      `}
    >
      <span className={`${isSm ? "text-[7px]" : "text-[9px]"} text-muted-foreground leading-none`}>
        {element.number}
      </span>
      <span className={`${isSm ? "text-[10px]" : "text-base"} font-bold leading-tight ${categoryTextColors[element.category]}`}>
        {element.symbol}
      </span>
      {!isSm && (
        <span className="text-[6px] text-muted-foreground leading-none truncate w-full text-center">
          {element.name}
        </span>
      )}
    </motion.button>
  );
};

export default ElementTile;
