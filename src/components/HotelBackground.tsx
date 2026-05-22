import { motion, useTransform, useReducedMotion } from "framer-motion";
import { globalScrollProgress } from "@/components/SmoothScroll";

// ─── Bokeh orb definitions ────────────────────────────────────────────────────
const ORBS = [
  { x: "15%", y: "25%", size: 220, opacity: 0.04,  blur: 70,  dur: 13, dy: 28, dx: 12 },
  { x: "82%", y: "38%", size: 290, opacity: 0.03,  blur: 90,  dur: 16, dy: 20, dx: 18 },
  { x: "48%", y: "68%", size: 160, opacity: 0.05,  blur: 55,  dur: 10, dy: 35, dx: 10 },
  { x: "22%", y: "78%", size: 330, opacity: 0.025, blur: 105, dur: 19, dy: 15, dx: 22 },
  { x: "72%", y: "14%", size: 190, opacity: 0.04,  blur: 75,  dur: 14, dy: 30, dx: 8  },
  { x: "91%", y: "58%", size: 250, opacity: 0.035, blur: 95,  dur: 17, dy: 22, dx: 16 },
  { x: "8%",  y: "52%", size: 175, opacity: 0.045, blur: 68,  dur: 12, dy: 32, dx: 14 },
  { x: "58%", y: "88%", size: 270, opacity: 0.03,  blur: 88,  dur: 15, dy: 18, dx: 20 },
];

// ─── Light shaft definitions ──────────────────────────────────────────────────
const SHAFTS = [
  { x: "22%",  rotate: -18, width: 120, dur: 7,  delay: 0   },
  { x: "52%",  rotate:   5, width: 80,  dur: 11, delay: 2.5 },
  { x: "76%",  rotate:  22, width: 100, dur: 9,  delay: 1   },
];

// ─── Grand Arch SVG ───────────────────────────────────────────────────────────
const GrandArch = () => (
  <svg
    viewBox="0 0 400 580"
    fill="none"
    preserveAspectRatio="xMidYMax meet"
    style={{ width: "100%", height: "100%" }}
  >
    <defs>
      <radialGradient id="archGlow" cx="50%" cy="18%" r="55%">
        <stop offset="0%"   stopColor="rgba(210,165,75,0.10)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <radialGradient id="keystoneGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="rgba(220,175,90,0.55)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>

    {/* Arch fill glow */}
    <path
      d="M 30 580 L 30 195 Q 30 42 200 42 Q 370 42 370 195 L 370 580 Z"
      fill="url(#archGlow)"
    />

    {/* Outer arch */}
    <path
      d="M 30 580 L 30 195 Q 30 42 200 42 Q 370 42 370 195 L 370 580"
      stroke="rgba(200,160,80,0.18)" strokeWidth="1.5"
    />

    {/* Inner arch */}
    <path
      d="M 72 580 L 72 214 Q 72 100 200 100 Q 328 100 328 214 L 328 580"
      stroke="rgba(200,160,80,0.09)" strokeWidth="1"
    />

    {/* Outermost frame */}
    <path
      d="M 8 580 L 8 192 Q 8 18 200 18 Q 392 18 392 192 L 392 580"
      stroke="rgba(200,160,80,0.06)" strokeWidth="1"
    />

    {/* Keystone at apex */}
    <ellipse cx="200" cy="42" rx="18" ry="13" stroke="rgba(200,160,80,0.30)" strokeWidth="1.5" />
    <ellipse cx="200" cy="42" rx="8"  ry="6"  fill="url(#keystoneGlow)" />

    {/* Spandrel ornaments — small diamonds */}
    <polygon points="60,130  67,140  60,150  53,140" stroke="rgba(200,160,80,0.18)" strokeWidth="1" />
    <polygon points="340,130 347,140 340,150 333,140" stroke="rgba(200,160,80,0.18)" strokeWidth="1" />

    {/* Impost blocks (where arch meets columns) */}
    <rect x="18"  y="195" width="24" height="10" stroke="rgba(200,160,80,0.20)" strokeWidth="1" />
    <rect x="358" y="195" width="24" height="10" stroke="rgba(200,160,80,0.20)" strokeWidth="1" />

    {/* Column shafts */}
    <line x1="30"  y1="205" x2="30"  y2="540" stroke="rgba(200,160,80,0.10)" strokeWidth="1.5" />
    <line x1="370" y1="205" x2="370" y2="540" stroke="rgba(200,160,80,0.10)" strokeWidth="1.5" />

    {/* Column bases */}
    <rect x="8"   y="540" width="44" height="12" stroke="rgba(200,160,80,0.16)" strokeWidth="1" />
    <rect x="348" y="540" width="44" height="12" stroke="rgba(200,160,80,0.16)" strokeWidth="1" />
    <rect x="4"   y="552" width="52" height="8"  stroke="rgba(200,160,80,0.12)" strokeWidth="1" />
    <rect x="344" y="552" width="52" height="8"  stroke="rgba(200,160,80,0.12)" strokeWidth="1" />

    {/* Horizontal entablature */}
    <line x1="4" y1="190" x2="396" y2="190" stroke="rgba(200,160,80,0.07)" strokeWidth="0.8" />

    {/* Frieze detail lines */}
    <line x1="8"   y1="180" x2="57"  y2="180" stroke="rgba(200,160,80,0.08)" strokeWidth="0.8" />
    <line x1="343" y1="180" x2="392" y2="180" stroke="rgba(200,160,80,0.08)" strokeWidth="0.8" />
  </svg>
);

// ─── Bangkok City Silhouette SVG ──────────────────────────────────────────────
const CitySilhouette = () => (
  <svg
    viewBox="0 0 1440 180"
    fill="none"
    preserveAspectRatio="xMidYMax meet"
    style={{ width: "100%", position: "absolute", bottom: 0 }}
  >
    {/* Simplified Bangkok skyline */}
    <path
      d="
        M0 180 L0 140 L40 140 L40 110 L55 110 L55 90 L65 90 L65 70 L70 70
        L70 55 L75 55 L75 70 L80 70 L80 90 L90 90 L90 110 L105 110 L105 140
        L130 140 L130 120 L145 120 L145 100 L155 100 L155 85 L165 85 L165 100
        L175 100 L175 120 L195 120 L195 95 L210 95 L210 75 L218 75 L218 60
        L222 60 L222 75 L230 75 L230 95 L250 95 L250 115 L270 115 L270 90
        L285 90 L285 65 L292 55 L295 45 L298 55 L305 65 L305 90 L320 90
        L320 110 L345 110 L345 85 L360 85 L360 70 L368 70 L368 58 L372 58
        L372 70 L380 70 L380 85 L400 85 L400 105 L420 105 L420 80 L435 80
        L435 60 L442 50 L448 38 L454 50 L461 60 L461 80 L480 80 L480 100
        L500 100 L500 75 L515 75 L515 55 L525 55 L525 40 L530 35 L535 40
        L535 55 L545 55 L545 75 L565 75 L565 95 L585 95 L585 70 L600 70
        L600 52 L607 52 L607 38 L614 38 L614 52 L620 52 L620 70 L640 70
        L640 90 L660 90 L660 68 L675 68 L675 50 L682 42 L686 32 L690 42
        L697 50 L697 68 L715 68 L715 88 L735 88 L735 65 L750 65 L750 48
        L758 48 L758 35 L763 35 L763 48 L770 48 L770 65 L790 65 L790 85
        L810 85 L810 62 L825 62 L825 45 L832 37 L836 28 L840 37 L847 45
        L847 62 L865 62 L865 82 L885 82 L885 58 L900 58 L900 42 L907 42
        L907 30 L912 25 L917 30 L917 42 L924 42 L924 58 L945 58 L945 78
        L965 78 L965 55 L980 55 L980 38 L988 30 L994 20 L1000 30 L1008 38
        L1008 55 L1025 55 L1025 75 L1045 75 L1045 52 L1060 52 L1060 35
        L1068 28 L1072 18 L1076 28 L1084 35 L1084 52 L1100 52 L1100 72
        L1120 72 L1120 50 L1135 50 L1135 34 L1142 26 L1146 16 L1150 26
        L1157 34 L1157 50 L1175 50 L1175 70 L1195 70 L1195 48 L1210 48
        L1210 32 L1218 24 L1222 14 L1226 24 L1234 32 L1234 48 L1250 48
        L1250 68 L1270 68 L1270 45 L1285 45 L1285 30 L1292 22 L1296 12
        L1300 22 L1308 30 L1308 45 L1325 45 L1325 65 L1345 65 L1345 42
        L1360 42 L1360 28 L1367 20 L1371 10 L1375 20 L1382 28 L1382 42
        L1400 42 L1400 62 L1440 62 L1440 180 Z
      "
      fill="rgba(255,255,255,0.035)"
    />
    {/* Subtle window lights */}
    {[295, 448, 530, 607, 686, 763, 836, 912, 994, 1072, 1146, 1222, 1296, 1371].map((x, i) => (
      <rect key={i} x={x - 2} y={i % 2 === 0 ? 40 : 30} width="4" height="4"
        fill={`rgba(200,160,80,${0.15 + (i % 3) * 0.08})`} />
    ))}
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────
const HotelBackground = () => {
  const shouldReduce = useReducedMotion();
  const s = globalScrollProgress;

  // Scene atmosphere opacities
  const lobbyOp     = useTransform(s, [0, 0.04, 0.17, 0.28], [0.85, 1,  1,  0]);
  const corridorOp  = useTransform(s, [0.12, 0.22, 0.33, 0.44], [0,   1,  1,  0]);
  const upperOp     = useTransform(s, [0.30, 0.40, 0.52, 0.62], [0,   1,  1,  0]);
  const elevatorOp  = useTransform(s, [0.48, 0.58, 0.70, 0.80], [0,   1,  1,  0]);
  const penthouseOp = useTransform(s, [0.68, 0.78, 0.88, 0.96], [0,   1,  1,  0]);
  const nightOp     = useTransform(s, [0.87, 0.94, 1.00, 1.00], [0,   1,  1,  1]);

  // Architecture parallax
  const archY        = useTransform(s, [0, 1], ["0%", "-12%"]);
  const archOpacity  = useTransform(s, [0, 0.08, 0.35, 0.55], [0.6, 1, 0.5, 0]);
  const cityY        = useTransform(s, [0, 1], ["0%", "5%"]);

  // Chandelier
  const chandelierOp = useTransform(s, [0, 0.08, 0.22, 0.40], [0.7, 1, 0.7, 0]);

  // Light shaft overall fade
  const shaftFade    = useTransform(s, [0, 0.10, 0.55, 0.75], [0.5, 1, 0.4, 0.1]);

  // Floor reflection
  const floorOp      = useTransform(s, [0, 0.10, 0.30, 0.50], [0.6, 1, 0.5, 0]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: "#0A0506" }}
    >
      {/* ── 1. Scene atmosphere layers ───────────────────────────────────── */}
      <motion.div
        style={{ opacity: lobbyOp }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 120% 70% at 50% 0%, #3D1A06 0%, #1A0C04 45%, #0A0506 100%)"
        }} />
      </motion.div>

      <motion.div
        style={{ opacity: corridorOp }}
        className="absolute inset-0"
      >
        {/* Cool blue-charcoal — The Corridor */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 100% 80% at 50% 40%, #060810 0%, #080C18 50%, #04060E 100%)"
        }} />
      </motion.div>

      <motion.div
        style={{ opacity: upperOp }}
        className="absolute inset-0"
      >
        {/* Warm charcoal — Upper Floor */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 100% 60% at 50% 20%, #1C0D06 0%, #0E0805 50%, #080505 100%)"
        }} />
      </motion.div>

      <motion.div
        style={{ opacity: elevatorOp }}
        className="absolute inset-0"
      >
        {/* Deep near-black, brass undertone — Elevator */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 50%, #0C0B04 0%, #070708 60%, #050506 100%)"
        }} />
      </motion.div>

      <motion.div
        style={{ opacity: penthouseOp }}
        className="absolute inset-0"
      >
        {/* Pure black with deep violet hint — Penthouse */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, #100514 0%, #050210 50%, #020208 100%)"
        }} />
        {/* City glow from below */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 140% 30% at 50% 100%, rgba(160,90,180,0.18) 0%, transparent 60%)"
        }} />
      </motion.div>

      <motion.div
        style={{ opacity: nightOp }}
        className="absolute inset-0"
      >
        {/* Deep night — moonlight from top-left */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 15% 0%, rgba(180,200,255,0.06) 0%, transparent 65%), #020205"
        }} />
        {/* Stars */}
        {!shouldReduce && STAR_POSITIONS.map((star, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left: star.x, top: star.y,
            width: star.s, height: star.s,
            background: "white",
            opacity: star.o,
          }} />
        ))}
      </motion.div>

      {/* ── 2. City silhouette (deepest architecture) ────────────────────── */}
      <motion.div
        style={{ y: cityY }}
        className="absolute inset-0 pointer-events-none"
      >
        <CitySilhouette />
      </motion.div>

      {/* ── 3. Grand Arch ────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: archY, opacity: archOpacity }}
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
      >
        <div style={{ width: "min(52vw, 520px)", height: "92vh", flexShrink: 0 }}>
          <GrandArch />
        </div>
      </motion.div>

      {/* ── 4. Chandelier glow ───────────────────────────────────────────── */}
      {/* Outer div drives scroll-based fade; inner div does the continuous pulse */}
      <motion.div
        style={{ opacity: chandelierOp }}
        className="absolute inset-x-0 top-0 pointer-events-none"
      >
        <motion.div
          animate={shouldReduce ? {} : { scale: [1, 1.07, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 0%" }}
        >
          <div style={{
            height: "72vh",
            background: "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(215,165,72,0.38) 0%, rgba(200,140,55,0.14) 28%, transparent 65%)",
          }} />
        </motion.div>
      </motion.div>

      {/* ── 5. Light shafts ──────────────────────────────────────────────── */}
      {/* Outer drives scroll-based opacity; inner breathes independently */}
      {SHAFTS.map((shaft, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: shaftFade,
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: "-10%",
              left: shaft.x,
              width: shaft.width,
              height: "130%",
              transform: `translateX(-50%) rotate(${shaft.rotate}deg)`,
              background: "linear-gradient(to bottom, transparent 0%, rgba(210,165,75,0.18) 25%, rgba(210,165,75,0.22) 50%, rgba(210,165,75,0.10) 75%, transparent 100%)",
              filter: "blur(28px)",
              transformOrigin: "50% 0%",
            }}
            animate={shouldReduce ? {} : { opacity: [0.4, 0.9, 0.4] }}
            transition={{
              duration: shaft.dur,
              delay: shaft.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* ── 6. Bokeh orbs ────────────────────────────────────────────────── */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, hsla(${38 + (i % 3) * 4}, 88%, 54%, ${orb.opacity * 2.5}) 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity * 20,
            willChange: "transform",
          }}
          animate={shouldReduce ? {} : {
            y: [0, -orb.dy, 0],
            x: [0,  orb.dx, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}

      {/* ── 7. Floor reflection ──────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: floorOp }}
        className="absolute inset-x-0 bottom-0 pointer-events-none"
      >
        <div style={{
          height: "35vh",
          background: "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(200,150,60,0.16) 0%, rgba(180,130,50,0.06) 40%, transparent 70%)",
        }} />
      </motion.div>

      {/* ── 8. Edge vignette ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── 9. Final darkening overlay ───────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.30)" }} />
    </div>
  );
};

// Pre-computed star positions for the night scene
const STAR_POSITIONS = Array.from({ length: 70 }, (_, i) => {
  const seed = i * 137.508;
  return {
    x: `${((seed * 0.618033) % 1) * 100}%`,
    y: `${((seed * 0.381966) % 1) * 60}%`,
    s: ((seed * 0.999) % 1) < 0.7 ? 1 : 2,
    o: 0.2 + ((seed * 0.7654) % 1) * 0.5,
  };
});

export default HotelBackground;
