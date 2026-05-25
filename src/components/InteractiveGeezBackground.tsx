import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const GEEZ_CODES = [
  0x1200, 0x1208, 0x1210, 0x1218, 0x1220, 0x1228, 0x1230, 0x1240,
  0x1260, 0x1270, 0x1290, 0x12A0, 0x12A8, 0x12C8, 0x12D0, 0x12D8,
  0x12E8, 0x12F0, 0x1308, 0x1320, 0x1330, 0x1340, 0x1348, 0x1350,
];

const GEEZ_CHARS = GEEZ_CODES.map((code) => String.fromCharCode(code));

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
    size: 1.4 + Math.random() * 3.2,
    baseOpacity: 0.07 + Math.random() * 0.09,
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
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((event.clientX - rect.left) / rect.width);
      mouseY.set((event.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute -left-16 top-0 h-[45vh] w-[45vh] rounded-full bg-secondary/30 blur-[100px]"
        animate={{ x: [0, 40, -10, 0], y: [0, 10, 30, 0], scale: [1, 1.15, 1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-0 h-[42vh] w-[42vh] rounded-full bg-primary/30 blur-[105px]"
        animate={{ x: [0, -35, 8, 0], y: [0, -20, 14, 0], scale: [1, 1.1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {chars.map((charData, index) => (
        <GeezChar key={`${charData.char}-${index}`} data={charData} index={index} mouseX={smoothX} mouseY={smoothY} />
      ))}
    </div>
  );
};

const GeezChar = ({
  data,
  index,
  mouseX,
  mouseY,
}: {
  data: CharData;
  index: number;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      if (!ref.current) return;
      const dx = data.x / 100 - mouseX.get();
      const dy = data.y / 100 - mouseY.get();
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repelStrength = Math.max(0, 1 - distance / 0.36) * 46;
      const angle = Math.atan2(dy, dx);
      const pushX = Math.cos(angle) * repelStrength;
      const pushY = Math.sin(angle) * repelStrength;
      const time = Date.now() / 1000;
      const floatX = Math.sin(time / data.speed + data.offset) * 14;
      const floatY = Math.cos(time / data.speed + data.offset * 1.3) * 18;
      const orbitX = Math.sin(time / (data.speed * 1.8) + index) * 9;
      const orbitY = Math.cos(time / (data.speed * 1.9) + index) * 8;
      const glowOpacity = data.baseOpacity + Math.max(0, 1 - distance / 0.24) * 0.22;

      ref.current.style.transform = `translate(${floatX + orbitX + pushX}px, ${floatY + orbitY + pushY}px) rotate(${Math.sin(time / data.speed) * 12}deg)`;
      ref.current.style.opacity = `${glowOpacity}`;
      ref.current.style.filter = `drop-shadow(0 0 ${8 + glowOpacity * 16}px hsl(var(--gold) / 0.35))`;
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [data, index, mouseX, mouseY]);

  return (
    <span
      ref={ref}
      className="pointer-events-none absolute select-none transition-[filter] duration-500"
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