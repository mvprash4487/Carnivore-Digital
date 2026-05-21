import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/* ─── Scroll system ─── */
const rawScrollRef  = { current: 0 };
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

/* ─── Math helpers ─── */
const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const range   = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth  = (t: number) => t * t * (3 - 2 * t);

/* ─── Camera waypoints ─── */
const WAYPOINTS = [
  { scroll: 0.00, pos: new THREE.Vector3(0, 2.5, 20),   look: new THREE.Vector3(0, 2.0, 0)     },
  { scroll: 0.10, pos: new THREE.Vector3(0, 2.0, 5),    look: new THREE.Vector3(0, 1.8, -2)    },
  { scroll: 0.18, pos: new THREE.Vector3(-4, 1.8, 1),   look: new THREE.Vector3(-4, 1.5, -3)   },
  { scroll: 0.27, pos: new THREE.Vector3(-4, 1.8, -2),  look: new THREE.Vector3(-4, 1.5, -5)   },
  { scroll: 0.34, pos: new THREE.Vector3(3, 1.5, -1),   look: new THREE.Vector3(3, 1.5, -5)    },
  { scroll: 0.42, pos: new THREE.Vector3(3, 1.5, -5),   look: new THREE.Vector3(3, 1.5, -8)    },
  { scroll: 0.47, pos: new THREE.Vector3(3, 1.5, -7),   look: new THREE.Vector3(3, 1.8, -9)    },
  { scroll: 0.65, pos: new THREE.Vector3(3, 15, -7),    look: new THREE.Vector3(3, 15.0, -9)   },
  { scroll: 0.73, pos: new THREE.Vector3(3, 15, -3),    look: new THREE.Vector3(3, 15.5, 0.5)  },
  { scroll: 0.82, pos: new THREE.Vector3(7, 15, 3),     look: new THREE.Vector3(12, 13, 8)     },
  { scroll: 1.00, pos: new THREE.Vector3(7, 15, 16),    look: new THREE.Vector3(0, 7, 0)       },
];

const _cp = new THREE.Vector3();
const _cl = new THREE.Vector3();
function getCameraState(scroll: number) {
  const p = clamp01(scroll);
  if (p <= WAYPOINTS[0].scroll) { _cp.copy(WAYPOINTS[0].pos); _cl.copy(WAYPOINTS[0].look); return { pos: _cp, look: _cl }; }
  const last = WAYPOINTS[WAYPOINTS.length - 1];
  if (p >= last.scroll) { _cp.copy(last.pos); _cl.copy(last.look); return { pos: _cp, look: _cl }; }
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i], b = WAYPOINTS[i + 1];
    if (p >= a.scroll && p <= b.scroll) {
      const t = smooth((p - a.scroll) / (b.scroll - a.scroll));
      _cp.lerpVectors(a.pos, b.pos, t);
      _cl.lerpVectors(a.look, b.look, t);
      return { pos: _cp, look: _cl };
    }
  }
  _cp.copy(last.pos); _cl.copy(last.look);
  return { pos: _cp, look: _cl };
}

/* ─── ScrollSmoother ─── */
const ScrollSmoother = () => {
  useFrame(() => {
    smoothScrollRef.current += (rawScrollRef.current - smoothScrollRef.current) * 0.06;
  });
  return null;
};

/* ─── Background color transitions ─── */
const DynamicBackground = () => {
  const col = useRef(new THREE.Color(0.039, 0.020, 0.024));
  useFrame(({ scene }) => {
    const p = smoothScrollRef.current;
    const t1 = smooth(range(p, 0.72, 0.84));
    const t2 = smooth(range(p, 0.84, 0.97));
    col.current.setRGB(
      lerp(lerp(0.039, 0.045, t1), 0.018, t2),
      lerp(lerp(0.020, 0.030, t1), 0.028, t2),
      lerp(lerp(0.024, 0.055, t1), 0.065, t2),
    );
    scene.background = col.current;
  });
  return null;
};

/* ─── Grand lobby structure ─── */
const LobbyFloor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]} receiveShadow>
    <planeGeometry args={[18, 34]} />
    <meshStandardMaterial color="#C8BFB4" roughness={0.45} metalness={0.08} />
  </mesh>
);

const LobbyCeiling = () => (
  <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.8, 1]}>
    <planeGeometry args={[18, 34]} />
    <meshStandardMaterial color="#E0D8D0" roughness={0.9} side={THREE.BackSide} />
  </mesh>
);

const LobbyWalls = () => (
  <group>
    <mesh position={[-8.5, 2.9, 1]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[34, 5.8]} />
      <meshStandardMaterial color="#D0C8BE" roughness={0.85} />
    </mesh>
    <mesh position={[8.5, 2.9, 1]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[34, 5.8]} />
      <meshStandardMaterial color="#D0C8BE" roughness={0.85} />
    </mesh>
    <mesh position={[0, 2.9, -13]}>
      <planeGeometry args={[17, 5.8]} />
      <meshStandardMaterial color="#D4CCC2" roughness={0.85} />
    </mesh>
    {/* Hotel exterior facade */}
    <mesh position={[0, 4.5, 14]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[22, 10]} />
      <meshStandardMaterial color="#A89880" roughness={0.7} />
    </mesh>
  </group>
);

const COLUMN_POSITIONS: [number, number, number][] = [
  [-5, 0, 4], [-5, 0, -4], [5, 0, 4], [5, 0, -4],
  [-5, 0, -10], [5, 0, -10],
  [-3.5, 0, 13], [3.5, 0, 13],
];

const LobbyColumns = () => {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    COLUMN_POSITIONS.forEach(([x, , z], i) => {
      dummy.position.set(x, 2.9, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COLUMN_POSITIONS.length]}>
      <boxGeometry args={[0.7, 5.8, 0.7]} />
      <meshStandardMaterial color="#C0B8AE" roughness={0.5} metalness={0.06} />
    </instancedMesh>
  );
};

/* ─── Chandelier ─── */
const Chandelier = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  const bulbPositions = useMemo<[number, number, number][]>(() => {
    const arr: [number, number, number][] = [];
    [1.0, 1.5, 2.0].forEach((r, ring) => {
      const count = 8 + ring * 4;
      for (let j = 0; j < count; j++) {
        const a = (j / count) * Math.PI * 2;
        arr.push([Math.cos(a) * r, -0.3 - ring * 0.22, Math.sin(a) * r]);
      }
    });
    return arr;
  }, []);

  useFrame(() => {
    const p = smoothScrollRef.current;
    const vis = smooth(range(p, 0.0, 0.08)) * (1 - smooth(range(p, 0.32, 0.44)));
    if (groupRef.current) groupRef.current.visible = vis > 0.005;
    if (lightRef.current) lightRef.current.intensity = vis * 3.0;
  });

  return (
    <group ref={groupRef} position={[0, 5.5, 2]}>
      <pointLight ref={lightRef} color="#FFD08A" distance={20} decay={1.4} />
      {[1.0, 1.5, 2.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.28 - i * 0.22, 0]}>
          <torusGeometry args={[r, 0.035, 8, 48]} />
          <meshStandardMaterial color="#B8923A" metalness={1} roughness={0.15} emissive="#3A2A10" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {bulbPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#FFD08A" emissive="#FFD08A" emissiveIntensity={3} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial color="#8A7040" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
};

/* ─── Entrance doors ─── */
const EntranceDoors = () => {
  const leftRef  = useRef<THREE.Mesh>(null!);
  const rightRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    const p = smoothScrollRef.current;
    const open = smooth(range(p, 0.02, 0.09));
    const fade = 1 - smooth(range(p, 0.18, 0.28));
    if (leftRef.current) {
      leftRef.current.position.x = -1.0 - open * 2.5;
      (leftRef.current.material as THREE.MeshStandardMaterial).opacity = fade;
    }
    if (rightRef.current) {
      rightRef.current.position.x = 1.0 + open * 2.5;
      (rightRef.current.material as THREE.MeshStandardMaterial).opacity = fade;
    }
  });
  return (
    <group position={[0, 0, 13]}>
      <mesh ref={leftRef} position={[-1.0, 1.9, 0]}>
        <boxGeometry args={[2.0, 3.8, 0.1]} />
        <meshStandardMaterial color="#B8923A" metalness={1} roughness={0.12} emissive="#3A2A10" emissiveIntensity={0.3} transparent />
      </mesh>
      <mesh ref={rightRef} position={[1.0, 1.9, 0]}>
        <boxGeometry args={[2.0, 3.8, 0.1]} />
        <meshStandardMaterial color="#B8923A" metalness={1} roughness={0.12} emissive="#3A2A10" emissiveIntensity={0.3} transparent />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 3.9, 0]}>
        <boxGeometry args={[4.4, 0.22, 0.18]} />
        <meshStandardMaterial color="#8A7040" metalness={1} roughness={0.25} />
      </mesh>
      {[-2.15, 2.15].map((x) => (
        <mesh key={x} position={[x, 1.9, 0]}>
          <boxGeometry args={[0.22, 4.2, 0.18]} />
          <meshStandardMaterial color="#8A7040" metalness={1} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
};

/* ─── Reception desk ─── */
const ReceptionDesk = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    const p = smoothScrollRef.current;
    const vis = smooth(range(p, 0.10, 0.22)) * (1 - smooth(range(p, 0.38, 0.48)));
    if (groupRef.current) groupRef.current.visible = vis > 0.01;
    if (lightRef.current) lightRef.current.intensity = vis * 1.2;
  });
  return (
    <group ref={groupRef} position={[-4, 0, -3.5]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.6, 1.0, 0.85]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 0.44]}>
        <boxGeometry args={[3.6, 1.0, 0.06]} />
        <meshStandardMaterial color="#B8923A" metalness={1} roughness={0.15} emissive="#3A2A10" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 1.06, 0]}>
        <boxGeometry args={[3.7, 0.08, 0.95]} />
        <meshStandardMaterial color="#1A0D04" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[1.2, 1.3, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.38, 8]} />
        <meshStandardMaterial color="#8A7040" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[1.2, 1.55, 0]}>
        <coneGeometry args={[0.18, 0.25, 12, 1, true]} />
        <meshStandardMaterial color="#2A1A0A" side={THREE.BackSide} />
      </mesh>
      <pointLight ref={lightRef} position={[1.2, 1.4, 0.5]} color="#FFC87A" distance={5} decay={2} />
      <Text position={[0, 1.5, 0.5]} fontSize={0.11} color="#C8A870" anchorX="center" anchorY="middle" letterSpacing={0.1}>
        RECEPTION
      </Text>
    </group>
  );
};

/* ─── Floor number — throttled state update ─── */
const FloorIndicator = () => {
  const [floor, setFloor] = useState("L");
  const timer = useRef(0);
  useFrame((_, delta) => {
    const p = smoothScrollRef.current;
    const rise = smooth(range(p, 0.47, 0.65));
    const num  = Math.round(lerp(1, 19, rise));
    const text = num < 2 ? "L" : String(num);
    timer.current += delta;
    if (timer.current > 0.12) {
      timer.current = 0;
      setFloor(prev => prev !== text ? text : prev);
    }
  });
  return (
    <Text position={[3, 4.8, -10.3]} fontSize={0.28} color="#FFD08A" anchorX="center" anchorY="middle">
      {floor}
    </Text>
  );
};

/* ─── Elevator lobby niche + doors ─── */
const ElevatorLobby = () => {
  const groupRef  = useRef<THREE.Group>(null!);
  const leftRef   = useRef<THREE.Mesh>(null!);
  const rightRef  = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    const p = smoothScrollRef.current;
    if (groupRef.current) groupRef.current.visible = smooth(range(p, 0.28, 0.38)) > 0.01;
    const opening    = smooth(range(p, 0.42, 0.46)) - smooth(range(p, 0.46, 0.50));
    const openingTop = smooth(range(p, 0.63, 0.67));
    const offset     = (Math.max(0, opening) + openingTop) * 1.15;
    if (leftRef.current)  leftRef.current.position.x  = 3 - 1.02 - offset;
    if (rightRef.current) rightRef.current.position.x = 3 + 1.02 + offset;
  });

  return (
    <group ref={groupRef}>
      {/* Alcove walls */}
      <mesh position={[3, 3, -10.5]}>
        <boxGeometry args={[5, 6, 0.12]} />
        <meshStandardMaterial color="#C0B8AE" roughness={0.7} />
      </mesh>
      <mesh position={[0.4, 3, -8.5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4, 6, 0.12]} />
        <meshStandardMaterial color="#C8C0B6" roughness={0.7} />
      </mesh>
      <mesh position={[5.6, 3, -8.5]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[4, 6, 0.12]} />
        <meshStandardMaterial color="#C8C0B6" roughness={0.7} />
      </mesh>
      {/* Brass doors */}
      <mesh ref={leftRef} position={[1.98, 2.6, -10.4]}>
        <boxGeometry args={[2.04, 3.2, 0.08]} />
        <meshStandardMaterial color="#B8923A" metalness={1} roughness={0.12} emissive="#3A2A10" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={rightRef} position={[4.02, 2.6, -10.4]}>
        <boxGeometry args={[2.04, 3.2, 0.08]} />
        <meshStandardMaterial color="#B8923A" metalness={1} roughness={0.12} emissive="#3A2A10" emissiveIntensity={0.3} />
      </mesh>
      {/* Door top bar */}
      <mesh position={[3, 4.3, -10.35]}>
        <boxGeometry args={[4.4, 0.22, 0.14]} />
        <meshStandardMaterial color="#8A7040" metalness={1} roughness={0.2} />
      </mesh>
      <FloorIndicator />
    </group>
  );
};

/* ─── Elevator shaft (tall walls, camera rises through) ─── */
const ElevatorShaft = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const mat0 = useRef<THREE.MeshStandardMaterial>(null!);
  const mat1 = useRef<THREE.MeshStandardMaterial>(null!);
  const mat2 = useRef<THREE.MeshStandardMaterial>(null!);
  const mat3 = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(() => {
    const p = smoothScrollRef.current;
    const o = smooth(range(p, 0.45, 0.50)) * (1 - smooth(range(p, 0.66, 0.72)));
    if (groupRef.current) groupRef.current.visible = o > 0.005;
    [mat0, mat1, mat2, mat3].forEach(r => { if (r.current) r.current.opacity = o; });
  });
  return (
    <group ref={groupRef} position={[3, 8.5, -9]}>
      <mesh position={[0, 0, -1.5]}>
        <boxGeometry args={[3.2, 18, 0.1]} />
        <meshStandardMaterial ref={mat0} color="#1A1410" roughness={0.9} transparent />
      </mesh>
      <mesh position={[-1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[3.2, 18, 0.1]} />
        <meshStandardMaterial ref={mat1} color="#1A1410" roughness={0.9} transparent />
      </mesh>
      <mesh position={[1.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[3.2, 18, 0.1]} />
        <meshStandardMaterial ref={mat2} color="#1A1410" roughness={0.9} transparent />
      </mesh>
      {/* Ceiling light strip */}
      <mesh position={[0, 8.6, -0.5]}>
        <boxGeometry args={[1.8, 0.06, 1.2]} />
        <meshStandardMaterial ref={mat3} color="#FFD08A" emissive="#FFD08A" emissiveIntensity={2} transparent />
      </mesh>
    </group>
  );
};

/* ─── Project frames inside elevator ─── */
const PROJECTS = [
  { title: "OCEAN MARINA",     sub: "Branding & Web",       color: "#C2532F" },
  { title: "THARA THONG",      sub: "Photography & Design", color: "#B8923A" },
  { title: "BURGER & LOBSTER", sub: "Digital Marketing",    color: "#C2532F" },
  { title: "CANOLINI",         sub: "Brand Identity",       color: "#B8923A" },
  { title: "ROSH",             sub: "UX / UI Design",       color: "#C2532F" },
  { title: "ASPIRA",           sub: "Web & SEO",            color: "#B8923A" },
];

const ProjectFrames = () => {
  const frameRefs = useRef<(THREE.Group | null)[]>(new Array(PROJECTS.length).fill(null));

  useFrame(() => {
    const p = smoothScrollRef.current;
    PROJECTS.forEach((_, i) => {
      const start = 0.47 + i * 0.03;
      const end   = start + 0.09;
      const vis   = smooth(range(p, start, start + 0.025)) * (1 - smooth(range(p, end - 0.02, end)));
      const ref   = frameRefs.current[i];
      if (ref) {
        ref.visible = vis > 0.005;
        ref.scale.setScalar(lerp(0.85, 1.0, vis));
      }
    });
  });

  return (
    <group position={[3, 0, -10.6]}>
      {PROJECTS.map((proj, i) => (
        <group
          key={proj.title}
          ref={(el) => { frameRefs.current[i] = el; }}
          position={[0, 2 + i * 2.2, 0]}
        >
          <mesh>
            <boxGeometry args={[2.0, 1.25, 0.04]} />
            <meshStandardMaterial color="#8A7040" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[1.84, 1.1, 0.025]} />
            <meshStandardMaterial color={proj.color} roughness={0.8} />
          </mesh>
          <Text position={[0, 0.18, 0.05]} fontSize={0.15} color="#F5E6D0" anchorX="center" anchorY="middle" maxWidth={1.7} textAlign="center">
            {proj.title}
          </Text>
          <Text position={[0, -0.1, 0.05]} fontSize={0.09} color="#C8A870" anchorX="center" anchorY="middle" maxWidth={1.7} textAlign="center">
            {proj.sub}
          </Text>
        </group>
      ))}
    </group>
  );
};

/* ─── 19th floor bulletin board ─── */
const CLIENTS = ["OCEAN", "RADISSON BLU", "ROYAL ORCHID SHERATON", "ASPIRA", "GETFRESH", "MARRIOTT", "BURGER & LOBSTER", "CANOLINI"];

const BulletinBoard = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const p = smoothScrollRef.current;
    const vis = smooth(range(p, 0.65, 0.75)) * (1 - smooth(range(p, 0.80, 0.88)));
    if (groupRef.current) groupRef.current.visible = vis > 0.005;
    if (lightRef.current) lightRef.current.intensity = vis * 3.0;
  });

  const grid = useMemo(() =>
    CLIENTS.map((name, i) => ({
      name,
      x: -2.1 + (i % 4) * 1.42,
      y: 15.6 - Math.floor(i / 4) * 1.3,
    }))
  , []);

  return (
    <group ref={groupRef} position={[3, 0, 0]} rotation={[0, Math.PI, 0]}>
      {/* Cork surface */}
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[6.4, 3.8, 0.12]} />
        <meshStandardMaterial color="#7A6248" roughness={1} />
      </mesh>
      {/* Dark wood frame */}
      <mesh position={[0, 15, 0.05]}>
        <boxGeometry args={[7.1, 4.5, 0.06]} />
        <meshStandardMaterial color="#4A3420" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Header text */}
      <Text position={[0, 16.7, -0.12]} fontSize={0.2} color="#C8A870" anchorX="center" anchorY="middle" letterSpacing={0.1}>
        OUR DISTINGUISHED GUESTS
      </Text>
      {/* Client pins */}
      {grid.map(({ name, x, y }) => (
        <group key={name} position={[x, y, -0.12]}>
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#C2532F" metalness={0.8} roughness={0.3} emissive="#8A1F2E" emissiveIntensity={0.5} />
          </mesh>
          <Text fontSize={0.13} color="#F5E6D0" anchorX="center" anchorY="middle" maxWidth={1.3} textAlign="center" letterSpacing={0.04}>
            {name}
          </Text>
        </group>
      ))}
      {/* Overhead warm light */}
      <pointLight ref={lightRef} position={[0, 19.5, -1.5]} color="#FFF0C8" distance={8} decay={1.8} />
    </group>
  );
};

/* ─── Floor-to-ceiling window ─── */
const WindowFrame = () => {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(() => {
    const p = smoothScrollRef.current;
    if (groupRef.current) groupRef.current.visible = p > 0.80;
  });
  return (
    <group ref={groupRef} position={[8, 15, 8]}>
      {[
        [0, 2.2, 0,  5.5, 0.22, 0.14],
        [0, -2.2, 0, 5.5, 0.22, 0.14],
        [-2.6, 0, 0, 0.18, 4.5, 0.14],
        [2.6, 0, 0,  0.18, 4.5, 0.14],
        [0, 0, 0,    0.1, 4.5,  0.12],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#4A3420" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

/* ─── Night cityscape ─── */
const Cityscape = ({ isMobile }: { isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef  = useRef<THREE.InstancedMesh>(null!);
  const glowRef  = useRef<THREE.InstancedMesh>(null!);
  const count    = isMobile ? 20 : 50;

  const { heights, positions } = useMemo(() => {
    const r = (() => { let s = 42; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
    return {
      heights:   Array.from({ length: count }, () => 2 + r() * 22),
      positions: Array.from({ length: count }, () => [(r() - 0.5) * 60, 0, 20 + r() * 50] as [number, number, number]),
    };
  }, [count]);

  useEffect(() => {
    if (!meshRef.current || !glowRef.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach(([x, , z], i) => {
      dummy.position.set(x, heights[i] / 2, z);
      dummy.scale.set(2 + (i % 4), heights[i], 2 + (i % 3));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      glowRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    glowRef.current.instanceMatrix.needsUpdate = true;
  }, [heights, positions]);

  useFrame(() => {
    const p = smoothScrollRef.current;
    if (groupRef.current) groupRef.current.visible = p > 0.81;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 45]}>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#05080E" />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0A0F1E" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1.02, 1.02, 1.02]} />
        <meshStandardMaterial color="#101830" emissive="#1A2848" emissiveIntensity={1.2} transparent opacity={0.35} side={THREE.BackSide} />
      </instancedMesh>
    </group>
  );
};

/* ─── Chapter lighting ─── */
const HotelLighting = () => {
  const lobbyRef    = useRef<THREE.PointLight>(null!);
  const receptRef   = useRef<THREE.PointLight>(null!);
  const elevRef     = useRef<THREE.PointLight>(null!);
  const skyRef      = useRef<THREE.DirectionalLight>(null!);

  useFrame(() => {
    const p = smoothScrollRef.current;
    if (lobbyRef.current)  lobbyRef.current.intensity  = lerp(0.6, 0, smooth(range(p, 0.35, 0.50)));
    if (receptRef.current) receptRef.current.intensity = smooth(range(p, 0.12, 0.24)) * (1 - smooth(range(p, 0.36, 0.46)));
    if (elevRef.current)   elevRef.current.intensity   = smooth(range(p, 0.44, 0.52)) * (1 - smooth(range(p, 0.68, 0.76))) * 1.4;
    if (skyRef.current)    skyRef.current.intensity    = smooth(range(p, 0.85, 0.96)) * 0.35;
  });

  return (
    <>
      <ambientLight intensity={0.09} />
      <pointLight ref={lobbyRef}  position={[0, 5, 2]}    color="#FFD08A" distance={22} decay={1.2} />
      <pointLight ref={receptRef} position={[-4, 3, -3]}  color="#FFC87A" distance={8}  decay={2}   />
      <pointLight ref={elevRef}   position={[3, 9, -8]}   color="#FFD08A" distance={12} decay={1.8} />
      <directionalLight ref={skyRef} position={[-10, 20, 10]} color="#8090B8" />
    </>
  );
};

/* ─── Camera rig ─── */
const HotelCameraRig = () => {
  const lookTarget = useRef(new THREE.Vector3(0, 2, 0));
  useFrame((state) => {
    const { pos, look } = getCameraState(smoothScrollRef.current);
    state.camera.position.lerp(pos, 0.05);
    lookTarget.current.lerp(look, 0.05);
    state.camera.lookAt(lookTarget.current);
  });
  return null;
};

/* ─── Assembled scene ─── */
const HotelSceneInner = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <ScrollSmoother />
    <DynamicBackground />
    <HotelLighting />
    {/* Ch1 — Grand Lobby */}
    <LobbyFloor />
    <LobbyCeiling />
    <LobbyWalls />
    <LobbyColumns />
    <Chandelier />
    <EntranceDoors />
    {/* Ch2 — Reception */}
    <ReceptionDesk />
    {/* Ch3-4 — Elevator lobby + shaft + frames */}
    <ElevatorLobby />
    <ElevatorShaft />
    <ProjectFrames />
    {/* Ch5 — Bulletin board */}
    <BulletinBoard />
    {/* Ch6 — Window + city */}
    <WindowFrame />
    <Cityscape isMobile={isMobile} />
    <HotelCameraRig />
  </>
);

/* ─── Public export ─── */
const HotelScene = () => {
  useScrollProgressInit();
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible]   = useState(true);

  useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 2.5, 20], fov: 60 }}
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance", stencil: false }}
      >
        <Suspense fallback={null}>
          <HotelSceneInner isMobile={isMobile} />
          {!isMobile && (
            <EffectComposer multisampling={0}>
              <Bloom intensity={0.5} luminanceThreshold={0.7} luminanceSmoothing={0.3} mipmapBlur />
              <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0006, 0.0006] as any} radialModulation={false} modulationOffset={0} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HotelScene;
