// Dirección visual: avatar Vendea — cuatro vistas con cursor, transición suave, sin etiquetas técnicas visibles.
import { useEffect, useRef, useState } from "react";

type CursorDirection = "center" | "up" | "left" | "right";
type CursorFrames = Record<CursorDirection, string>;

interface CursorAvatarProps {
  frames: CursorFrames;
  ease?: number;
  tilt?: number;
}

const DIRECTION_ORDER: CursorDirection[] = ["center", "up", "left", "right"];

export default function CursorAvatar({ frames, ease = 0.1, tilt = 6.5 }: CursorAvatarProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const directionRef = useRef<CursorDirection>("center");
  const [direction, setDirection] = useState<CursorDirection>("center");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enter = 0.29;
    const exit = 0.15;

    const pickDirection = (x: number, y: number): CursorDirection => {
      const threshold = (item: CursorDirection) => (directionRef.current === item ? exit : enter);
      if (y < -threshold("up") && Math.abs(x) < 0.62) return "up";
      if (x < -threshold("left")) return "left";
      if (x > threshold("right")) return "right";
      return "center";
    };

    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.current.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
      target.current.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1));
    };
    const resetPointer = () => { target.current = { x: 0, y: 0 }; };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    let raf = 0;
    const tick = (time: number) => {
      const point = current.current;
      point.x += (target.current.x - point.x) * (reduced ? 1 : ease);
      point.y += (target.current.y - point.y) * (reduced ? 1 : ease);
      const next = pickDirection(point.x, point.y);
      if (next !== directionRef.current) {
        directionRef.current = next;
        setDirection(next);
      }
      if (innerRef.current) {
        const float = reduced ? 0 : Math.sin(time / 1450) * 2.5;
        innerRef.current.style.transform = `translate3d(${(point.x * 8).toFixed(2)}px, ${(point.y * 6 + float).toFixed(2)}px, 0) rotateY(${(point.x * tilt).toFixed(2)}deg) rotateX(${(-point.y * 3.2).toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("pointerleave", resetPointer);
    };
  }, [ease, tilt]);

  return (
    <div className="cursor-avatar-component" role="img" aria-label="Avatar interactivo de Vendea">
      <div ref={innerRef} className="cursor-avatar-inner">
        {DIRECTION_ORDER.map((item) => (
          <img key={item} src={frames[item]} alt="" draggable={false} className={`cursor-avatar-frame ${direction === item ? "is-active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
