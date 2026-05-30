import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const GEEZ_CODES = [
  0x1200, 0x1208, 0x1210, 0x1218, 0x1220, 0x1228, 0x1230, 0x1240,
  0x1260, 0x1270, 0x1290, 0x12a0, 0x12a8, 0x12c8, 0x12d0, 0x12d8,
  0x12e8, 0x12f0, 0x1308, 0x1320, 0x1330, 0x1340, 0x1348, 0x1350,
];

const GEEZ_CHARS = GEEZ_CODES.map((code) => String.fromCharCode(code));

interface CharData {
  char: string;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  rotate: number;
}

function generateChars(count: number): CharData[] {
  return Array.from({ length: count }, (_, i) => ({
    char: GEEZ_CHARS[i % GEEZ_CHARS.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.4 + Math.random() * 3.2,
    baseOpacity: 0.07 + Math.random() * 0.09,
    duration: 7 + Math.random() * 7,
    delay: Math.random() * -12,
    driftX: -18 + Math.random() * 36,
    driftY: -22 + Math.random() * 44,
    rotate: -14 + Math.random() * 28,
  }));
}

interface Props {
  count?: number;
  className?: string;
}

const InteractiveGeezBackground = ({ count = 30, className = "" }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chars = useMemo(() => generateChars(count), [count]);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 55, damping: 24, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 55, damping: 24, mass: 0.4 });
  const parallaxX = useTransform(smoothX, [0, 1], [18, -18]);
  const parallaxY = useTransform(smoothY, [0, 1], [12, -12]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`absolute inset-0 overflow-hidden pointer-events-auto contain-paint ${className}`}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute -left-16 top-0 h-[45vh] w-[45vh] rounded-full bg-secondary/30 blur-[100px] will-change-transform"
        animate={{ x: [0, 40, -10, 0], y: [0, 10, 30, 0], scale: [1, 1.15, 1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-0 h-[42vh] w-[42vh] rounded-full bg-primary/30 blur-[105px] will-change-transform"
        animate={{ x: [0, -35, 8, 0], y: [0, -20, 14, 0], scale: [1, 1.1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div className="absolute inset-0 pointer-events-none" style={{ x: parallaxX, y: parallaxY }}>
        {chars.map((charData, index) => (
          <GeezChar key={`${charData.char}-${index}`} data={charData} />
        ))}
      </motion.div>
    </div>
  );
};

const GeezChar = ({ data }: { data: CharData }) => (
  <span
    className="geez-background-char"
    style={{
      left: `${data.x}%`,
      top: `${data.y}%`,
      fontSize: `${data.size}rem`,
      opacity: data.baseOpacity,
      "--float-duration": `${data.duration}s`,
      "--float-delay": `${data.delay}s`,
      "--float-from-x": `${data.driftX * -0.45}px`,
      "--float-from-y": `${data.driftY * -0.35}px`,
      "--float-from-rotate": `${data.rotate * -0.45}deg`,
      "--float-mid-x": `${data.driftX * 0.35}px`,
      "--float-mid-y": `${data.driftY * 0.5}px`,
      "--float-mid-rotate": `${data.rotate * 0.35}deg`,
      "--float-x": `${data.driftX}px`,
      "--float-y": `${data.driftY}px`,
      "--float-rotate": `${data.rotate}deg`,
    } as React.CSSProperties}
  >
    {data.char}
  </span>
);

export default InteractiveGeezBackground;
