import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/* ─── scroll progress (raw + smoothed) ─── */
const rawScrollRef = { current: 0 };
const smoothScrollRef = { current: 0 };
const useScrollProgressInit = () => {
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      rawScrollRef.current = h > 0 ? window.scrollY / h : 0;
    };
    onScroll();
    smoothScrollRef.current = rawScrollRef.current;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

/* ─── ScrollSmoother — runs first each frame, single source of truth ─── */
const ScrollSmoother = () => {
  useFrame(() => {
    smoothScrollRef.current += (rawScrollRef.current - smoothScrollRef.current) * 0.08;
  });
  return null;
};

/* ─── Burgundy smoke shader ─── */
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
  uniform vec3  uTone;   // oxblood
  uniform vec3  uHi;     // brass highlight

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

    float t = uTime * 0.05;
    vec3 q = vec3(p * (1.5 + uScroll*0.7), t + uScroll*0.5);
    float n = fbm(q + vec3(0.0, t*0.4, 0.0));
    n = pow(n, 1.5);

    float d = length(p);
    float core = exp(-d * (3.4 - sin(uTime*0.5)*0.12));
    float halo = exp(-d * 1.05) * 0.4;

    // wine base + brass highlights inside the smoke
    vec3 col = uTone * core * (0.5 + 0.5*n)
             + uHi   * core * 0.18 * n
             + uTone * halo * (0.25 + 0.55*n)
             + uTone * 0.04 * n;

    // dawn horizon
    float dawn = smoothstep(0.85, 1.0, uScroll);
    float horizon = smoothstep(0.18, 0.0, abs(uv.y - 0.18)) * smoothstep(0.0,0.4,uv.y);
    col += uHi * horizon * dawn * 0.7;

    // drift chapter — extra wine wash
    float drift = smoothstep(0.18,0.40,uScroll) * (1.0 - smoothstep(0.55,0.75,uScroll));
    col += uTone * 0.10 * drift * fbm(q*2.4 + vec3(0.0,uTime*0.25,0.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SmokeBackground = () => {
  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uScroll: { value: 0 },
    uRes:    { value: new THREE.Vector2(1, 1) },
    uTone:   { value: new THREE.Color("#6B1220") },
    uHi:     { value: new THREE.Color("#C2532F") },
  }), []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = smoothScrollRef.current;
    const s = state.size;
    uniforms.uRes.value.set(s.width, s.height);
  });
  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
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

/* ─── Sparks — edge-fade so wraps are invisible ─── */
const Sparks = ({ count }: { count: number }) => {
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

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uScroll: { value: 0 },
    uTone:   { value: new THREE.Color("#E08A52") },
    uSize:   { value: 22 },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = smoothScrollRef.current;
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
      p.x += sin(t*1.1 + p.y*0.6) * 1.4;
      p.y += cos(t*0.9 + p.z*0.5) * 1.1 + uScroll * 1.5;
      p.z += sin(t*1.3 + p.x*0.4) * 1.2;
      // unwrapped — fade by distance from bowl center, no teleports
      float dist = length(p) / 14.0;
      float edge = 1.0 - smoothstep(0.7, 1.05, dist);

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize * (1.0 / -mv.z);

      float chapter = smoothstep(0.16,0.38,uScroll)
                    * (1.0 - smoothstep(0.78,0.92,uScroll));
      vAlpha = chapter * edge * (0.4 + 0.6 * fract(aSeed*0.137));
    }
  `;
  const frag = /* glsl */ `
    precision highp float;
    uniform vec3 uTone;
    varying float vAlpha;
    void main(){
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      float s = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(uTone * s, s * vAlpha);
    }
  `;

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed"    count={count} array={seeds}     itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
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

/* ─── Forge — wine-lacquer chrome knot, scale-driven visibility ─── */
const Knot = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const p = smoothScrollRef.current;
    const inT  = smooth(range(p, 0.10, 0.30));
    const outT = smooth(range(p, 0.62, 0.82));
    const presence = inT * (1 - outT);
    const sc = presence * lerp(0.6, 1.6, inT);
    const mesh = ref.current;
    mesh.scale.setScalar(sc);
    mesh.rotation.y = state.clock.elapsedTime * 0.15 + inT * Math.PI * 1.2;
    mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.12;
    mesh.visible = sc > 0.01;
  });
  const material = isMobile ? (
    <meshStandardMaterial color="#8A1F2E" metalness={1} roughness={0.28} emissive="#2A0509" emissiveIntensity={0.35} />
  ) : (
    <meshPhysicalMaterial color="#8A1F2E" metalness={1} roughness={0.2} clearcoat={1} clearcoatRoughness={0.18} iridescence={0.2} iridescenceIOR={1.3} emissive="#2A0509" emissiveIntensity={0.25} />
  );
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusKnotGeometry args={[0.9, 0.26, isMobile ? 128 : 220, isMobile ? 24 : 32, 2, 3]} />
      {material}
    </mesh>
  );
};

/* ─── Lattice — edge-fade flow, no hard mod snap ─── */
const Lattice = ({ count }: { count: number }) => {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => {
    const arr: { x: number; y: number; z0: number; r: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 12,
        z0: Math.random() * 60,
        r: Math.random() * Math.PI,
      });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const p = smoothScrollRef.current;
    const inT  = smooth(range(p, 0.58, 0.78));
    const outT = smooth(range(p, 0.90, 1.00));
    const fade = inT * (1 - outT);
    const flow = state.clock.elapsedTime * 1.2 + inT * 28;

    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      // wrap the position offset, but fade the cell as it nears the wrap edges
      const raw = (s.z0 + flow) % 60;
      const z = raw - 30;
      // cell-level edge fade: invisible at front (-30) and back (+30)
      const edge = Math.min(
        smooth(clamp01((z + 30) / 6)),     // fade in from far
        smooth(clamp01((30 - z) / 6))      // fade out near camera
      );
      dummy.position.set(s.x, s.y, z);
      dummy.rotation.set(s.r, s.r * 0.7, 0);
      const sc = (0.35 + (i % 5) * 0.05) * edge;
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (matRef.current) matRef.current.opacity = fade * 0.4;
    ref.current.visible = fade > 0.01;
  });

  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);
  return (
    <instancedMesh ref={ref as any} args={[geo as any, undefined as any, count]} frustumCulled={false}>
      <lineBasicMaterial ref={matRef} color="#A23A2C" transparent depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
};

/* ─── Camera spline ─── */
const CameraRig = () => {
  const curve = useMemo(() =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0,  6),
      new THREE.Vector3(0, 0,  4.2),
      new THREE.Vector3(0, 0,  3.0),
      new THREE.Vector3(0, 0,  1.2),
      new THREE.Vector3(0, -0.4, 4),
    ], false, "catmullrom", 0.4),
  []);
  useFrame((state) => {
    const p = clamp01(smoothScrollRef.current);
    const pos = curve.getPoint(p);
    state.camera.position.lerp(pos, 0.08);
    const look = curve.getPoint(Math.min(1, p + 0.02));
    state.camera.lookAt(look.x, look.y + (p > 0.85 ? -0.4 : 0), look.z - 1);
  });
  return null;
};

/* ─── Scene root ─── */
const Scene = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <>
      <color attach="background" args={["#0A0506"]} />
      <ambientLight intensity={0.10} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} color="#E08A52" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#8A1F2E" />

      <ScrollSmoother />
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
  useScrollProgressInit();
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
              <Bloom intensity={0.6} luminanceThreshold={0.75} luminanceSmoothing={0.3} mipmapBlur />
              <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0008, 0.0008] as any} radialModulation={false} modulationOffset={0} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LiquidGoldScene;
