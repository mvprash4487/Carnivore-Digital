import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { range: [0.00, 0.17] as [number, number], src: "/videos/01-lobby.mp4"      },
  { range: [0.17, 0.28] as [number, number], src: "/videos/02-reception.mp4"  },
  { range: [0.28, 0.42] as [number, number], src: "/videos/03-elev-lobby.mp4" },
  { range: [0.42, 0.65] as [number, number], src: "/videos/04-elevator.mp4"   },
  { range: [0.65, 0.82] as [number, number], src: "/videos/05-bulletin.mp4"   },
  { range: [0.82, 1.00] as [number, number], src: "/videos/06-window.mp4"     },
];

function getChapterIndex(scrollProgress: number): number {
  for (let i = 0; i < CHAPTERS.length; i++) {
    const [a, b] = CHAPTERS[i].range;
    if (scrollProgress >= a && scrollProgress <= b) return i;
  }
  return CHAPTERS.length - 1;
}

const VideoBackground = () => {
  const videoRefs  = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef  = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      const next = getChapterIndex(p);
      if (next === activeRef.current) return;

      // Pause old, play new
      const prev = videoRefs.current[activeRef.current];
      if (prev) { prev.pause(); prev.currentTime = 0; }

      const cur = videoRefs.current[next];
      if (cur) cur.play().catch(() => {});

      activeRef.current = next;
      setActiveIdx(next);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Kick off first video
    const first = videoRefs.current[0];
    if (first) first.play().catch(() => {});

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0A0506]">
      {CHAPTERS.map((ch, i) => (
        <video
          key={ch.src}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={ch.src}
          muted
          playsInline
          preload="auto"
          loop
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: activeIdx === i ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      ))}
      {/* Legibility overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
    </div>
  );
};

export default VideoBackground;
