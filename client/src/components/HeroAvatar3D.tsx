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

function Model({ url, pointer, onReady }: { url: string; pointer: React.MutableRefObject<PointerPosition>; onReady: () => void }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

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

  useEffect(() => onReady(), [onReady]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.1);
    const targetYaw = pointer.current.x * 0.28;
    const targetPitch = -pointer.current.y * 0.14;

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetYaw, 5.4, dt);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetPitch, 5.4, dt);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, pointer.current.x * -0.035, 5.4, dt);
    group.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.055;
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
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px), (prefers-reduced-motion: reduce)");
    const updateMode = () => setUseStaticFallback(media.matches);
    updateMode();
    media.addEventListener("change", updateMode);
    return () => media.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    if (useStaticFallback) return;
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.current.x = THREE.MathUtils.clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
    };
    const resetPointer = () => { pointer.current = { x: 0, y: 0 }; };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    return () => {
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("pointerleave", resetPointer);
    };
  }, [useStaticFallback]);

  if (useStaticFallback) {
    return <img className="avatar-3d-poster is-static" src={fallbackSrc} alt="Avatar de Vendea" draggable={false} />;
  }

  return (
    <div className="avatar-3d-component" role="img" aria-label="Avatar 3D interactivo de Vendea">
      <img className={`avatar-3d-poster ${ready ? "is-hidden" : ""}`} src={fallbackSrc} alt="" draggable={false} />
      <Canvas
        className="avatar-3d-canvas"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.15], fov: 33 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        fallback={<img className="avatar-3d-poster" src={fallbackSrc} alt="Avatar de Vendea" />}
      >
        <Lighting />
        <Suspense fallback={null}>
          <Model url={modelUrl} pointer={pointer} onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}
