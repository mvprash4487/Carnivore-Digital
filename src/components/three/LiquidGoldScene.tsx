import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/* ─── scroll progress (ref-based, no React re-renders) ─── */
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
const smooth = (t: number) => t * t * (3 - 2 * t);

/* ─── I & II: Volumetric smoke + ember field (single fullscreen shader) ─── */
const smokeVert = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const smokeFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uRes;
  uniform vec3  uGold;

  // hash + value noise — cheap, smooth enough for atmosphere
  float hash(vec3 p){ p = fract(p*0.3183099+vec3(0.71,0.113,0.419));
    p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
  float noise(vec3 x){
    vec3 p=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(p+vec3(0,0,0)),hash(p+vec3(1,0,0)),f.x),
                   mix(hash(p+vec3(0,1,0)),hash(p+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(p+vec3(0,0,1)),hash(p+vec3(1,0,1)),f.x),
                   mix(hash(p+vec3(0,1,1)),hash(p+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float fbm(vec3 p){
    float a=0.5, s=0.0;
    for(int i=0;i<5;i++){ s+=a*noise(p); p*=2.02; a*=0.5; }
    return s;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p  = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0);

    float t = uTime * 0.06;
    // slow rotating noise field; scroll deepens & shifts it
    vec3 q = vec3(p * (1.6 + uScroll*0.8), t + uScroll*0.6);
    float n = fbm(q + vec3(0.0, t*0.5, 0.0));
    n = pow(n, 1.4);

    // soft radial light source — breathes
    float d = length(p);
    float core = exp(-d * (3.2 - sin(uTime*0.6)*0.15));
    float halo = exp(-d * 1.1) * 0.45;

    // composite: dark base + gold core/halo modulated by smoke
    vec3 base = vec3(0.0);
    vec3 col  = base
              + uGold * core * (0.55 + 0.45*n)
              + uGold * halo * (0.25 + 0.6*n)
              + uGold * 0.05 * n;

    // chapter V "dawn" — horizon line glow rising from bottom
    float dawn = smoothstep(0.85, 1.0, uScroll);
    float horizon = smoothstep(0.18, 0.0, abs(uv.y - 0.18)) * smoothstep(0.0,0.4,uv.y);
    col += uGold * horizon * dawn * 0.9;

    // chapter II "drift" boost
    float drift = smoothstep(0.18,0.40,uScroll) * (1.0 - smoothstep(0.55,0.75,uScroll));
    col += uGold * 0.08 * drift * fbm(q*2.5 + vec3(0.0,uTime*0.3,0.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SmokeBackground = () => {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const progress = useScrollProgressRef();
  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uScroll: { value: 0 },
    uRes:    { value: new THREE.Vector2(1, 1) },
    uGold:   { value: new THREE.Color("#C9A84C") },
  }), []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = progress.current;
    const size = state.size;
    uniforms.uRes.value.set(size.width, size.height);
  });
  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={smokeVert}
        fragmentShader={smokeFrag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

/* ─── II–III: GPU particles on curl-noise paths ─── */
const Sparks = ({ count }: { count: number }) => {
  const ref = useRef<THREE.Points>(null!);
  const progress = useScrollProgressRef();
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      seeds[i] = Math.random() * 1000;
    }
    return { positions, seeds };
  }, [count]);

  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uScroll:  { value: 0 },
    uGold:    { value: new THREE.Color("#E0B85C") },
    uSize:    { value: 22 },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = progress.current;
  });

  const vert = /* glsl */ `
    attribute float aSeed;
    uniform float uTime;
    uniform float uScroll;
    uniform float uSize;
    varying float vAlpha;
    void main(){
      vec3 p = position;
      float t = uTime * 0.18 + aSeed;
      // curl-ish offset using nested sines (cheap, no noise lookup)
      p.x += sin(t*1.1 + p.y*0.6) * 1.4;
      p.y += cos(t*0.9 + p.z*0.5) * 1.1 + uScroll * 1.5;
      p.z += sin(t*1.3 + p.x*0.4) * 1.2;
      // wrap so the field stays populated
      p.y = mod(p.y + 6.0, 12.0) - 6.0;

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize * (1.0 / -mv.z);

      // appears in Drift, peaks Forge, fades Lattice, gone in Dawn
      float a = smoothstep(0.16,0.38,uScroll)
              * (1.0 - smoothstep(0.78,0.92,uScroll));
      vAlpha = a * (0.4 + 0.6 * fract(aSeed*0.137));
    }
  `;
  const frag = /* glsl */ `
    precision highp float;
    uniform vec3 uGold;
    varying float vAlpha;
    void main(){
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      float s = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(uGold * s, s * vAlpha);
    }
  `;

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed"    count={count} array={seeds}     itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
};

/* ─── III: Forge — chrome-gold torus knot ─── */
const Knot = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const progress = useScrollProgressRef();
  useFrame((state) => {
    const p = progress.current;
    const op = range(p, 0.34, 0.66);
    const fade = smooth(op) * (1 - smooth(range(p, 0.66, 0.85)));
    const mesh = ref.current;
    mesh.scale.setScalar(lerp(0.2, 1.6, smooth(op)) * (0.6 + fade * 0.6));
    mesh.rotation.y = state.clock.elapsedTime * 0.18 + op * Math.PI * 1.4;
    mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
    (mesh.material as any).opacity = fade;
    mesh.visible = fade > 0.01;
  });
  const material = isMobile ? (
    <meshStandardMaterial color="#C9A84C" metalness={1} roughness={0.25} emissive="#3a2a0a" emissiveIntensity={0.3} transparent />
  ) : (
    <meshPhysicalMaterial color="#C9A84C" metalness={1} roughness={0.18} clearcoat={1} clearcoatRoughness={0.2} iridescence={0.25} iridescenceIOR={1.3} transparent />
  );
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusKnotGeometry args={[0.9, 0.26, isMobile ? 128 : 220, isMobile ? 24 : 32, 2, 3]} />
      {material}
    </mesh>
  );
};

/* ─── IV: Lattice — instanced wireframe cells flying past camera ─── */
const Lattice = ({ count }: { count: number }) => {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const progress = useScrollProgressRef();
  const matRef = useRef<THREE.LineBasicMaterial>(null!);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => {
    const arr: { x: number; y: number; z: number; r: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 12,
        z: -Math.random() * 60,
        r: Math.random() * Math.PI,
      });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const p = progress.current;
    const op = range(p, 0.6, 0.9);
    const fade = smooth(op) * (1 - smooth(range(p, 0.9, 1.0)));
    const flow = state.clock.elapsedTime * 1.4 + op * 30;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const z = ((s.z + flow) % 60) - 30;
      dummy.position.set(s.x, s.y, z);
      dummy.rotation.set(s.r, s.r * 0.7, 0);
      const sc = 0.35 + (i % 5) * 0.05;
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (matRef.current) matRef.current.opacity = fade * 0.55;
    ref.current.visible = fade > 0.01;
  });

  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);
  return (
    <instancedMesh ref={ref as any} args={[geo as any, undefined as any, count]} frustumCulled={false}>
      <lineBasicMaterial ref={matRef} color="#C9A84C" transparent depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
};

/* ─── camera spline ─── */
const CameraRig = () => {
  const progress = useScrollProgressRef();
  const curve = useMemo(() =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0,  6),    // I  Ember
      new THREE.Vector3(0, 0,  4.2),  // II Drift
      new THREE.Vector3(0, 0,  3.0),  // III Forge
      new THREE.Vector3(0, 0,  1.2),  // IV Lattice (fly through)
      new THREE.Vector3(0, -0.4, 4),  // V  Dawn (pull back)
    ], false, "catmullrom", 0.4),
  []);
  useFrame((state) => {
    const p = clamp01(progress.current);
    const pos = curve.getPoint(p);
    state.camera.position.lerp(pos, 0.12);
    const look = curve.getPoint(Math.min(1, p + 0.02));
    state.camera.lookAt(look.x, look.y + (p > 0.85 ? -0.4 : 0), look.z - 1);
  });
  return null;
};

/* ─── Scene root ─── */
const Scene = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <>
      <color attach="background" args={["#070707"]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#E0B85C" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#C9A84C" />

      <SmokeBackground />
      <Sparks count={isMobile ? 220 : 800} />
      <Knot isMobile={isMobile} />
      <Lattice count={isMobile ? 120 : 380} />

      <CameraRig />
    </>
  );
};

/* ─── public component ─── */
const LiquidGoldScene = () => {
  const [enabled, setEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance", stencil: false, depth: true }}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} />
          {!isMobile && (
            <EffectComposer multisampling={0}>
              <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
              <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0008, 0.0008] as any} radialModulation={false} modulationOffset={0} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LiquidGoldScene;
