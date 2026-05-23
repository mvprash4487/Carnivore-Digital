import { useEffect, useRef, useState } from "react";

const CDN = "https://raw.githubusercontent.com/mvprash4487/Carnivore-Digital/main/public/videos";

const CHAPTERS: { type: "image" | "video"; range: [number, number]; src: string }[] = [
  { type: "video", range: [0.00, 0.13], src: `${CDN}/01-descent.mp4`    },
  { type: "video", range: [0.13, 0.25], src: `${CDN}/02-street.mp4`     },
  { type: "video", range: [0.25, 0.38], src: `${CDN}/03-chinatown.mp4`  },
  { type: "video", range: [0.38, 0.65], src: `${CDN}/04-neon.mp4`       },
  { type: "video", range: [0.65, 0.82], src: `${CDN}/05-nightmarket.mp4`},
  { type: "video", range: [0.82, 1.00], src: `${CDN}/06-skyline.mp4`    },
];

function getChapterIndex(p: number): number {
  for (let i = 0; i < CHAPTERS.length; i++) {
    const [a, b] = CHAPTERS[i].range;
    if (p >= a && p <= b) return i;
  }
  return CHAPTERS.length - 1;
}

const sharedStyle = (visible: boolean): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: visible ? 1 : 0,
  transition: "opacity 0.8s ease",
});

const VideoBackground = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      const next = getChapterIndex(p);
      if (next === activeRef.current) return;

      const prev = videoRefs.current[activeRef.current];
      if (prev) { prev.pause(); prev.currentTime = 0; }

      videoRefs.current[next]?.play().catch(() => {});

      activeRef.current = next;
      setActiveIdx(next);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    videoRefs.current[0]?.play().catch(() => {});

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#080B14]">
      {CHAPTERS.map((ch, i) =>
        ch.type === "image" ? (
          <img
            key={ch.src}
            src={ch.src}
            alt=""
            style={sharedStyle(activeIdx === i)}
          />
        ) : (
          <video
            key={ch.src}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={ch.src}
            muted
            playsInline
            preload="auto"
            loop
            style={sharedStyle(activeIdx === i)}
          />
        )
      )}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
    </div>
  );
};

export default VideoBackground;
