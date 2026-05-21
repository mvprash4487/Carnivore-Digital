import { Composition } from "remotion";
import { Showreel } from "./compositions/Showreel";

export const RemotionRoot = () => {
  return (
    <>
      {/* 4K 30fps — 10 second showreel */}
      <Composition
        id="Showreel"
        component={Showreel}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
      />
      {/* 1080p version for quick preview / social */}
      <Composition
        id="Showreel-1080"
        component={Showreel}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
