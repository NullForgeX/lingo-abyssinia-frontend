import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const GEEZ_CHARS = [
  "ሀ",
  "ለ",
  "ሐ",
  "መ",
  "ሠ",
  "ረ",
  "ሰ",
  "ቀ",
  "በ",
  "ተ",
  "ነ",
  "ከ",
  "ወ",
  "ዘ",
  "የ",
  "ደ",
  "ገ",
  "ጠ",
  "ጰ",
  "ፀ",
  "አ",
  "ኀ",
  "ፈ",
  "ጸ",
];

interface CharData {
  char: string;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  speed: number;
  offset: number;
}

function generateChars(count: number): CharData[] {
  return Array.from({ length: count }, (_, i) => ({
    char: GEEZ_CHARS[i % GEEZ_CHARS.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.8 + Math.random() * 4.4,
    baseOpacity: 0.08 + Math.random() * 0.08,
    speed: 3 + Math.random() * 4.5,
    offset: Math.random() * Math.PI * 2,
  }));
}

interface Props {
  count?: number;
  className?: string;
}

const InteractiveGeezBackground = ({ count = 30, className = "" }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chars] = useState(() => generateChars(count));
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-0 h-[45vh] w-[45vh] rounded-full bg-secondary/30 blur-[100px]"
        animate={{
          x: [0, 40, -10, 0],
          y: [0, 10, 30, 0],
          scale: [1, 1.15, 1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-[42vh] w-[42vh] rounded-full bg-primary/30 blur-[105px]"
        animate={{
          x: [0, -35, 8, 0],
          y: [0, -20, 14, 0],
          scale: [1, 1.1, 1.05, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {chars.map((c, i) => (
        <GeezChar
          key={i}
          data={c}
          mouseX={smoothX}
          mouseY={smoothY}
          index={i}
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--secondary) / 0.15), transparent 52%)",
        }}
      />
    </div>
  );
};

interface GeezCharProps {
  data: CharData;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  index: number;
}

const GeezChar = ({ data, mouseX, mouseY, index }: GeezCharProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (!ref.current) return;
      const mx = mouseX.get();
      const my = mouseY.get();

      // Distance from cursor (normalized 0-1)
      const dx = data.x / 100 - mx;
      const dy = data.y / 100 - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Push away from cursor with falloff
      const repelStrength = Math.max(0, 1 - dist / 0.36) * 48;
      const angle = Math.atan2(dy, dx);
      const pushX = Math.cos(angle) * repelStrength;
      const pushY = Math.sin(angle) * repelStrength;

      // Floating animation
      const t = Date.now() / 1000;
      const floatX = Math.sin(t / data.speed + data.offset) * 14;
      const floatY = Math.cos(t / data.speed + data.offset * 1.3) * 18;

      const orbitX = Math.sin(t / (data.speed * 1.8) + index) * 9;
      const orbitY = Math.cos(t / (data.speed * 1.9) + index) * 8;

      // Autonomous wind drift to keep letters moving even without cursor input
      const windX = Math.sin(t * 0.35 + index * 0.35 + data.offset) * 16;
      const windY = Math.cos(t * 0.28 + index * 0.22 + data.offset) * 20;

      // Glow effect near cursor
      const glowOpacity =
        data.baseOpacity + Math.max(0, 1 - dist / 0.24) * 0.24;

      ref.current.style.transform = `translate(${floatX + orbitX + windX + pushX}px, ${floatY + orbitY + windY + pushY}px) rotate(${Math.sin(t / data.speed) * 12}deg)`;
      ref.current.style.opacity = `${glowOpacity}`;
      ref.current.style.filter = `drop-shadow(0 0 ${8 + glowOpacity * 16}px hsl(var(--gold) / 0.35))`;

      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [data, mouseX, mouseY]);

  return (
    <span
      ref={ref}
      className="absolute select-none pointer-events-none transition-[filter] duration-500"
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
        fontSize: `${data.size}rem`,
        opacity: data.baseOpacity,
        fontFamily: "Fraunces, serif",
        color: "hsl(var(--primary-foreground))",
        textShadow: "0 0 12px hsl(var(--gold) / 0.35)",
        willChange: "transform, opacity",
      }}
    >
      {data.char}
    </span>
  );
};

export default InteractiveGeezBackground;
