// Dirección visual: avatar Vendea en el hero — retrato 3D orgánico, respuesta suave al cursor y fallback estático accesible.
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PointerPosition = { x: number; y: number };

interface HeroAvatar3DProps {
  modelUrl: string;
  fallbackSrc: string;
}

function Model({ url, pointer, onReady, reducedMotion }: { url: string; pointer: React.MutableRefObject<PointerPosition>; onReady: () => void; reducedMotion: boolean }) {
  // El GLB del hero usa Meshopt; evitamos inicializar Draco y activamos su decodificador de forma explícita.
  const { scene } = useGLTF(url, false, true);
  const groupRef = useRef<THREE.Group>(null);
  const hasRenderedFrame = useRef(false);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 2.55 / Math.max(size.x, size.y, size.z);

    clone.scale.setScalar(scale);
    clone.position.copy(center.multiplyScalar(-scale));
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!hasRenderedFrame.current) {
      hasRenderedFrame.current = true;
      onReady();
    }

    const dt = Math.min(delta, 0.1);
    // prefers-reduced-motion anula SOLO el movimiento autonomo (oscilacion y
    // flotacion). El giro hacia el cursor se conserva: es manipulacion directa
    // del usuario, no animacion que ocurra sola.
    const idle = reducedMotion ? 0 : 1;
    // Oscilacion de reposo: presente para que no se vea muerto con el mouse
    // quieto, pero subordinada al cursor. El cursor manda.
    const idleYaw = Math.sin(clock.elapsedTime * 1.18) * 0.3 * idle;
    const idlePitch = Math.sin(clock.elapsedTime * 0.8 + 1.1) * 0.06 * idle;
    // El clamp evita que la suma de ciclo + cursor sobregire la cabeza.
    const targetYaw = THREE.MathUtils.clamp(idleYaw + pointer.current.x * 0.75, -1.05, 1.05);
    // SIN el signo menos: en three.js un rotation.x positivo apunta la cara
    // hacia abajo, y clientY ya crece hacia abajo. Negarlo invierte el eje.
    const targetPitch = THREE.MathUtils.clamp(idlePitch + pointer.current.y * 0.28, -0.36, 0.36);
    const floatY = Math.sin(clock.elapsedTime * 1.1) * 0.055 * idle;

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetYaw, 6.4, dt);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetPitch, 6.4, dt);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, pointer.current.x * -0.045 + Math.sin(clock.elapsedTime * 1.18) * -0.055 * idle, 6.4, dt);
    group.position.x = THREE.MathUtils.damp(group.position.x, pointer.current.x * 0.08 + Math.sin(clock.elapsedTime * 1.18) * 0.045 * idle, 6.4, dt);
    group.position.y = THREE.MathUtils.damp(group.position.y, floatY - pointer.current.y * 0.045, 6.4, dt);
  });

  return <group ref={groupRef}><primitive object={model} /></group>;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2.8, 3.8, 4.8]} intensity={2.5} color="#fff5e9" castShadow />
      <directionalLight position={[-3.4, 1.3, 2]} intensity={1.45} color="#17d978" />
      <directionalLight position={[3.2, -0.4, -1.6]} intensity={1.2} color="#7588ff" />
      <pointLight position={[0, 1.8, 2.4]} intensity={1.1} color="#ff7865" />
    </>
  );
}

export default function HeroAvatar3D({ modelUrl, fallbackSrc }: HeroAvatar3DProps) {
  const pointer = useRef<PointerPosition>({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const updatePointerPosition = (clientX: number, clientY: number) => {
    pointer.current.x = THREE.MathUtils.clamp((clientX / window.innerWidth) * 2 - 1, -1, 1);
    pointer.current.y = THREE.MathUtils.clamp((clientY / window.innerHeight) * 2 - 1, -1, 1);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => setReducedMotion(media.matches);
    updateMode();
    media.addEventListener("change", updateMode);
    return () => media.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      updatePointerPosition(event.clientX, event.clientY);
    };
    const resetPointer = () => { pointer.current = { x: 0, y: 0 }; };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    return () => {
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <div
      className={`avatar-3d-component ${ready ? "is-ready" : ""}`}
      role="img"
      aria-label="Avatar 3D interactivo de Vendea"
      onPointerMove={(event) => {
        updatePointerPosition(event.clientX, event.clientY);
      }}
      onPointerDown={(event) => {
        updatePointerPosition(event.clientX, event.clientY);
      }}
    >
      {!ready && <img className="avatar-3d-poster" src={fallbackSrc} alt="" draggable={false} />}
      <Canvas
        className="avatar-3d-canvas"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.15], fov: 33 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        fallback={<img className="avatar-3d-poster" src={fallbackSrc} alt="Avatar de Vendea" />}
      >
        <Lighting />
        <Suspense fallback={null}>
          <Model url={modelUrl} pointer={pointer} onReady={() => setReady(true)} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
