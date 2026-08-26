// Dirección visual: secuencia Vendea — cuatro vistas con scroll, inercia y microrespuesta al puntero.
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

export type ScrollAvatarDirection = "front" | "left" | "up" | "right";

type ScrollAvatarFrames = Record<ScrollAvatarDirection, string>;

interface ScrollAvatarProps {
  frames: ScrollAvatarFrames;
  progress: MotionValue<number>;
  onDirectionChange?: (direction: ScrollAvatarDirection) => void;
  damping?: number;
  tilt?: number;
}

const DIRECTION_ORDER: ScrollAvatarDirection[] = ["front", "left", "up", "right"];
const damp = (current: number, target: number, lambda: number, delta: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta));

export default function ScrollAvatar({
  frames,
  progress,
  onDirectionChange,
  damping = 5,
  tilt = 6.8,
}: ScrollAvatarProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef<ScrollAvatarDirection>("front");
  const [direction, setDirection] = useState<ScrollAvatarDirection>("front");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targetRef.current = progress.get();

    const unsubscribe = progress.on("change", (value) => {
      targetRef.current = Math.max(0, Math.min(1, value));
    });

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const resetPointer = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", resetPointer);

    const pickDirection = (value: number, current: ScrollAvatarDirection): ScrollAvatarDirection => {
      const enter = 0.035;
      const exit = 0.075;
      const frontLeft = 0.25;
      const leftUp = 0.5;
      const upRight = 0.75;

      if (current === "front") return value > frontLeft + enter ? "left" : "front";
      if (current === "left") {
        if (value < frontLeft - exit) return "front";
        if (value > leftUp + enter) return "up";
        return "left";
      }
      if (current === "up") {
        if (value < leftUp - exit) return "left";
        if (value > upRight + enter) return "right";
        return "up";
      }
      return value < upRight - exit ? "up" : "right";
    };

    let raf = 0;
    let previousTime = performance.now();
    const tick = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.1);
      previousTime = time;
      currentRef.current = reduced ? targetRef.current : damp(currentRef.current, targetRef.current, damping, delta);
      const nextDirection = pickDirection(currentRef.current, directionRef.current);

      if (nextDirection !== directionRef.current) {
        directionRef.current = nextDirection;
        setDirection(nextDirection);
        onDirectionChange?.(nextDirection);
      }

      if (innerRef.current) {
        const centered = currentRef.current * 2 - 1;
        const pointerX = reduced ? 0 : pointerRef.current.x;
        const pointerY = reduced ? 0 : pointerRef.current.y;
        const bob = reduced ? 0 : Math.sin(time / 1450) * 3;
        const x = centered * 7 + pointerX * 7;
        const y = pointerY * 5 + bob;
        const yaw = centered * tilt + pointerX * 3.8;
        const pitch = -pointerY * 3.1;
        innerRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateY(${yaw.toFixed(2)}deg) rotateX(${pitch.toFixed(2)}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", resetPointer);
    };
  }, [damping, onDirectionChange, progress, tilt]);

  return (
    <div className="scroll-avatar-component" aria-label={`Avatar Vendea: ${direction}`} role="img">
      <span className="scroll-avatar-component-glow" aria-hidden="true" />
      <div ref={innerRef} className="scroll-avatar-component-inner">
        {DIRECTION_ORDER.map((item) => (
          <img
            key={item}
            src={frames[item]}
            alt=""
            draggable={false}
            className={`scroll-avatar-component-frame ${direction === item ? "is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
