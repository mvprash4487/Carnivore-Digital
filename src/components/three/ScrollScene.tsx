import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Float, Environment, useTexture } from "@react-three/drei";

import heroFlame from "@/assets/hero-flame.jpg";
import lobster from "@/assets/lobster.jpg";
import burgerChef from "@/assets/burger-chef.jpg";
import truffle from "@/assets/truffle.jpg";
import chefPlating from "@/assets/chef-plating.jpg";
import wineGlasses from "@/assets/wine-glasses.jpg";
import burgerLobster from "@/assets/burger-lobster.jpg";
import tuktuk from "@/assets/tuktuk.jpg";

const ALL_TEXTURES = [heroFlame, lobster, burgerChef, truffle, chefPlating, wineGlasses, burgerLobster, tuktuk];
useTexture.preload(ALL_TEXTURES);

const configureTexture = (tex: THREE.Texture, maxAniso: number) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(4, maxAniso);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
};

const scrollProgressRef = { current: 0 };
const useScrollProgressRef = () => {
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = h > 0 ? window.scrollY / h : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollProgressRef;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const ImagePlane = ({
  url,
  position,
  rotation,
  scale,
  opacity = 1,
  animatedOpacity = false,
  renderOrder = 0,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number];
  opacity?: number;
  animatedOpacity?: boolean;
  renderOrder?: number;
}) => {
  const tex = useTexture(url);
  const { gl } = useThree();
  useMemo(() => configureTexture(tex, gl.capabilities.getMaxAnisotropy()), [tex, gl]);
  const isTransparent = animatedOpacity || opacity < 1;
  return (
    <mesh position={position} rotation={rotation} renderOrder={renderOrder}>
      <planeGeometry args={[scale[0], scale[1], 1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent={isTransparent}
        opacity={opacity}
        depthWrite={!isTransparent}
        toneMapped={false}
      />
    </mesh>
  );
};

const Embers = ({ count = 80 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 10 - 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const a = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      a[i * 3 + 1] += dt * (0.3 + (i % 5) * 0.08);
      a[i * 3] += Math.sin(performance.now() * 0.0005 + i) * dt * 0.1;
      if (a[i * 3 + 1] > 6) a[i * 3 + 1] = -4;
    }
    pos.needsUpdate = true;
    ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#E0B85C" transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const portfolio = [lobster, burgerChef, truffle, chefPlating, wineGlasses, burgerLobster];

const Scene = ({ isMobile, reducedMotion }: { isMobile: boolean; reducedMotion: boolean }) => {
  const progress = useScrollProgressRef();
  const heroRef = useRef<THREE.Group>(null!);
  const tukRef = useRef<THREE.Group>(null!);
  const orbitRef = useRef<THREE.Group>(null!);
  const trackRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progress.current;

    const z = lerp(4, 14, range(p, 0.15, 0.35));
    const z2 = lerp(z, 6, range(p, 0.55, 0.8));
    const z3 = lerp(z2, 2, range(p, 0.92, 1));
    state.camera.position.z = z3;
    state.camera.position.x = Math.sin(t * 0.15) * 0.2;
    state.camera.position.y = lerp(0, -1.5, range(p, 0.55, 0.8));

    if (heroRef.current) {
      const fade = 1 - range(p, 0.1, 0.22);
      heroRef.current.scale.setScalar(lerp(1, 1.2, range(p, 0, 0.2)));
      (heroRef.current.children[0] as any).material.opacity = fade * 0.9;
    }

    if (tukRef.current) {
      const tp = range(p, 0.18, 0.42);
      tukRef.current.position.x = lerp(-20, 20, tp);
      tukRef.current.position.y = Math.sin(tp * Math.PI) * 0.3;
      (tukRef.current.children[0] as any).material.opacity = Math.sin(tp * Math.PI) * 0.9;
    }

    if (orbitRef.current) {
      const op = range(p, 0.35, 0.55);
      orbitRef.current.rotation.y = op * Math.PI * 1.5 + t * 0.05;
      orbitRef.current.position.y = lerp(-8, 0, op);
      orbitRef.current.scale.setScalar(lerp(0.6, 1, op));
    }

    if (trackRef.current) {
      const tp = range(p, 0.5, 0.85);
      trackRef.current.position.z = lerp(-30, 8, tp);
    }
  });

  return (
    <>
      <color attach="background" args={["#0A0A0A"]} />
      <fog attach="fog" args={["#0A0A0A", 8, 30]} />
      <ambientLight intensity={isMobile ? 0.55 : 0.4} />
      <pointLight position={[0, 3, 4]} intensity={2} color="#E0B85C" />
      {isMobile ? (
        <pointLight position={[-3, -2, 3]} intensity={0.6} color="#C9A84C" />
      ) : (
        <Environment preset="night" />
      )}

      <group ref={heroRef} position={[0, 0, 0]}>
        <ImagePlane url={heroFlame} position={[0, 0, 0]} scale={[8, 5]} animatedOpacity renderOrder={-2} />
      </group>

      {!reducedMotion && <Embers count={isMobile ? 25 : 80} />}

      <group ref={tukRef} position={[-20, 0, 0]}>
        <ImagePlane url={tuktuk} position={[0, 0, 0]} scale={[16, 10]} opacity={0} animatedOpacity renderOrder={-1} />
      </group>

      {!isMobile && (
        <>
          <Float speed={1} rotationIntensity={0.3} floatIntensity={0.4}>
            <mesh position={[0, 0, -2]} rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[2.4, 0.012, 16, 120]} />
              <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.6} metalness={1} roughness={0.2} />
            </mesh>
          </Float>

          <group ref={orbitRef} position={[0, -8, 0]}>
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2;
              return (
                <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                  <mesh position={[Math.cos(a) * 3, Math.sin(a) * 0.6, Math.sin(a) * 3]} rotation={[0, -a, 0]}>
                    <planeGeometry args={[1.6, 2.2]} />
                    <meshStandardMaterial color="#1a1a1a" emissive="#C9A84C" emissiveIntensity={0.05} metalness={0.8} roughness={0.3} />
                  </mesh>
                </Float>
              );
            })}
          </group>
        </>
      )}

      <group ref={trackRef}>
        {portfolio.map((src, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const z = -i * 6;
          return (
            <Float key={i} speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
              <ImagePlane
                url={src}
                position={[side * 2.6, ((i % 3) - 1) * 0.8, z]}
                rotation={[0, -side * 0.25, 0]}
                scale={[3.2, 4.2]}
              />
            </Float>
          );
        })}
      </group>
    </>
  );
};

const ScrollScene = () => {
  const [enabled, setEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    if (reduced) setEnabled(false);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={isMobile ? [1, 1] : [1, 1.25]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 4], fov: isMobile ? 60 : 55 }}
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance", stencil: false, depth: true }}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ScrollScene;
