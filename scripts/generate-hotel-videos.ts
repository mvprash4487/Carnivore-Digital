/**
 * Runway Gen-3 Alpha — Hotel Video Generator
 *
 * Usage:
 *   RUNWAY_API_KEY=your_key_here npx tsx scripts/generate-hotel-videos.ts
 *
 * Get your API key: https://app.runwayml.com/settings → API Keys
 * Each 5-second video costs ~5 Runway credits (~$0.05).
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const API_KEY = process.env.RUNWAY_API_KEY;
if (!API_KEY) {
  console.error("❌  Set RUNWAY_API_KEY environment variable first.");
  console.error("    RUNWAY_API_KEY=your_key npx tsx scripts/generate-hotel-videos.ts");
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), "public", "videos");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const CHAPTERS = [
  {
    filename: "01-lobby.mp4",
    prompt:
      "Cinematic slow forward dolly through grand luxury hotel lobby entrance, ornate marble columns, crystal chandelier glowing warm gold, polished marble floors reflecting light, brass and gold accents, rich warm lighting, smooth camera movement, photorealistic, 4K",
  },
  {
    filename: "02-reception.mp4",
    prompt:
      "Luxury five-star hotel reception desk close-up, warm amber lighting, white marble counter with brass inlay detailing, elegant flower arrangement, slow cinematic push-in camera movement, soft bokeh background, photorealistic, 4K",
  },
  {
    filename: "03-elev-lobby.mp4",
    prompt:
      "Luxury hotel elevator lobby, gleaming polished brass elevator doors reflecting warm chandelier light, marble wall panels, decorative sconces, camera glides smoothly forward toward closed elevator doors, photorealistic, cinematic, 4K",
  },
  {
    filename: "04-elevator.mp4",
    prompt:
      "Interior of luxury hotel elevator rising, warm brass paneled walls with subtle wood inlay, illuminated floor indicator panel counting upward from 1 to 19, soft overhead light, smooth vertical ascent, photorealistic, cinematic 4K",
  },
  {
    filename: "05-bulletin.mp4",
    prompt:
      "Elegant 19th floor hotel corridor, warm spotlight on a polished brass and cork announcement board with gold name plates, slow cinematic camera drift forward, dim ambient lighting, luxury hotel atmosphere, photorealistic, 4K",
  },
  {
    filename: "06-window.mp4",
    prompt:
      "Slow cinematic zoom-out pullback through floor-to-ceiling glass window of luxury hotel penthouse suite, Bangkok city skyline at night, thousands of glittering lights spread across the horizon, sweeping panoramic view, photorealistic, 4K",
  },
];

async function post(url: string, body: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          "X-Runway-Version": "2024-11-06",
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try { resolve(JSON.parse(body)); }
          catch { reject(new Error(`Bad JSON: ${body}`)); }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { Authorization: `Bearer ${API_KEY}`, "X-Runway-Version": "2024-11-06" } },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try { resolve(JSON.parse(body)); }
          catch { reject(new Error(`Bad JSON: ${body}`)); }
        });
      }
    ).on("error", reject);
  });
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location!, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve as any));
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function pollTask(taskId: string): Promise<string> {
  const url = `https://api.dev.runwayml.com/v1/tasks/${taskId}`;
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await get(url);
    const status = res.status ?? res.progressRatio;
    process.stdout.write(`\r  polling… status=${res.status ?? "?"} (${i * 5}s)`);
    if (res.status === "SUCCEEDED") {
      process.stdout.write("\n");
      return res.output?.[0] ?? res.artifacts?.[0]?.url;
    }
    if (res.status === "FAILED") throw new Error(`Task failed: ${JSON.stringify(res.error)}`);
  }
  throw new Error("Timed out after 10 minutes");
}

async function generateVideo(chapter: (typeof CHAPTERS)[0]): Promise<void> {
  const dest = path.join(OUT_DIR, chapter.filename);
  if (fs.existsSync(dest)) {
    console.log(`  ✓ ${chapter.filename} already exists, skipping.`);
    return;
  }

  console.log(`\n▶  Generating ${chapter.filename}…`);

  // Dark luxury hotel starting frame — solid near-black with warm undertone
  // gen4_turbo is image-to-video; promptImage seeds the first frame
  const seedImage = chapter.seedImage ??
    "https://placehold.co/1280x720/0a0506/0a0506.png";

  const task = await post("https://api.dev.runwayml.com/v1/image_to_video", {
    model: "gen4_turbo",
    promptImage: seedImage,
    promptText: chapter.prompt,
    duration: 10,
    ratio: "1280:720",
  });

  if (!task.id) throw new Error(`No task id returned: ${JSON.stringify(task)}`);
  console.log(`  Task ${task.id} submitted.`);

  const videoUrl = await pollTask(task.id);
  if (!videoUrl) throw new Error("No output URL in task result");

  console.log(`  Downloading → ${chapter.filename}…`);
  await download(videoUrl, dest);
  console.log(`  ✅ Saved ${chapter.filename}`);
}

(async () => {
  console.log("🎬  Carnivore Digital — Hotel Video Generator");
  console.log(`    Output directory: ${OUT_DIR}\n`);

  for (const chapter of CHAPTERS) {
    try {
      await generateVideo(chapter);
    } catch (err) {
      console.error(`  ❌ Failed ${chapter.filename}:`, (err as Error).message);
    }
  }

  console.log("\n✅  All done. Run `npm run dev` to see the videos in the browser.");
})();
