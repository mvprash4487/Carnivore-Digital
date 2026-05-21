import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

/* ─── Smoke background — driven by frame progress, not scroll ─── */
const smokeVert = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const smokeFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uRes;
  uniform vec3  uTone;
  uniform vec3  uHi;

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
    vec3 q = vec3(p * (1.5 + uProgress * 0.7), t + uProgress * 0.5);
    float n = fbm(q + vec3(0.0, t * 0.4, 0.0));
    n = pow(n, 1.5);
    float d = length(p);
    float core = exp(-d * (3.4 - sin(uTime*0.5)*0.12));
    float halo = exp(-d * 1.05) * 0.4;
    vec3 col = uTone * core * (0.5 + 0.5*n)
             + uHi   * core * 0.18 * n
             + uTone * halo * (0.25 + 0.55*n)
             + uTone * 0.04 * n;
    float dawn = smoothstep(0.85, 1.0, uProgress);
    float horizon = smoothstep(0.18, 0.0, abs(uv.y - 0.18)) * smoothstep(0.0, 0.4, uv.y);
    col += uHi * horizon * dawn * 0.7;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const SmokeBackground = ({ progress }: { progress: number }) => {
  const uniforms = useMemo(() => ({
    uTime:     { value: 0 },
    uProgress: { value: 0 },
    uRes:      { value: new THREE.Vector2(3840, 2160) },
    uTone:     { value: new THREE.Color("#6B1220") },
    uHi:       { value: new THREE.Color("#C2532F") },
  }), []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value = progress;
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

const Knot = ({ scale, rotation }: { scale: number; rotation: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15 + rotation;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.12;
  });
  return (
    <mesh ref={ref} scale={scale}>
      <torusKnotGeometry args={[0.9, 0.26, 220, 32, 2, 3]} />
      <meshPhysicalMaterial
        color="#8A1F2E"
        metalness={1}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.18}
        iridescence={0.2}
        iridescenceIOR={1.3}
        emissive="#2A0509"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
};

const Scene = ({ progress }: { progress: number }) => {
  const knotScale = Math.max(0, progress < 0.8
    ? progress / 0.4
    : 1 - (progress - 0.8) / 0.2
  );
  return (
    <>
      <color attach="background" args={["#0A0506"]} />
      <ambientLight intensity={0.10} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} color="#E08A52" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#8A1F2E" />
      <SmokeBackground progress={progress} />
      <Knot scale={knotScale * 1.4} rotation={progress * Math.PI * 2} />
    </>
  );
};

/* ─── Title overlay ─── */
const TitleCard = ({ opacity, subtitle }: { opacity: number; subtitle: string }) => (
  <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
    <div style={{
      textAlign: "center",
      opacity,
      transform: `translateY(${(1 - opacity) * 40}px)`,
    }}>
      <div style={{
        fontFamily: "serif",
        fontSize: 160,
        fontWeight: 300,
        color: "#F5E6D0",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        lineHeight: 1,
        textShadow: "0 0 80px rgba(194, 83, 47, 0.6)",
      }}>
        CARNIVORE
      </div>
      <div style={{
        fontFamily: "sans-serif",
        fontSize: 48,
        fontWeight: 100,
        color: "#C2532F",
        letterSpacing: "0.5em",
        textTransform: "uppercase",
        marginTop: 24,
      }}>
        {subtitle}
      </div>
    </div>
  </AbsoluteFill>
);

/* ─── Main composition ─── */
export const Showreel = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames;

  const titleOpacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const knotEntrance = spring({ frame, fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 60 });

  return (
    <AbsoluteFill style={{ background: "#0A0506" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene progress={progress * knotEntrance} />
        </Suspense>
      </Canvas>

      <TitleCard opacity={titleOpacity} subtitle="Digital Studio" />
    </AbsoluteFill>
  );
};
