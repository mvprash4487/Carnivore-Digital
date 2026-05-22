/**
 * Runway Gen-4 Turbo — Streets of Bangkok Video Generator
 *
 * Usage (PowerShell):
 *   $env:RUNWAY_API_KEY="your_key"; npm run generate:videos
 *
 * Force-regenerate all (delete existing and start fresh):
 *   $env:RUNWAY_API_KEY="your_key"; $env:FORCE="1"; npm run generate:videos
 *
 * Regenerate from a specific shot onwards (e.g. shot 3):
 *   Delete 03-chinatown.mp4 through 06-skyline.mp4, then re-run without FORCE.
 *   The script skips existing shots and extracts their last frame for continuity.
 *
 * Get your API key: https://app.runwayml.com/settings → API Keys
 * Each 10-second video costs ~10 Runway credits (~$0.10).
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { execSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";

const API_KEY = process.env.RUNWAY_API_KEY;
if (!API_KEY) {
  console.error("❌  Set RUNWAY_API_KEY environment variable first.");
  console.error("    PowerShell: $env:RUNWAY_API_KEY=\"your_key\"; npm run generate:videos");
  process.exit(1);
}

const FORCE = process.env.FORCE === "1";
const OUT_DIR = path.join(process.cwd(), "public", "videos");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const SEED_DIR = "D:/Carnivore Digital/Website/Images";

const CHAPTERS = [
  {
    filename: "01-descent.mp4",
    seedImagePath: path.join(SEED_DIR, "AdobeStock_118155118.jpeg"),
    prompt:
      "Slow cinematic drone begins high above Bangkok city center at golden hour, looking across the skyline. MahaNakhon tower dominates the right side. Camera descends slowly and smoothly toward the city, tilting forward. Warm golden orange light bathes glass towers and rooftops. Expressways and the Chao Phraya river shimmer below. Motion blur on the moving traffic far below, light trails streaking across roads. Dense urban grid alive with movement. Camera descends from high altitude toward rooftop level, majestic and cinematic. Anamorphic lens flare, cinematic motion blur, 8K photorealistic, golden hour.",
  },
  {
    filename: "02-street.mp4",
    seedImagePath: path.join(SEED_DIR, "AdobeStock_191591143.jpeg"),
    prompt:
      "Slow aerial tracking shot above Bangkok's famous Rod Fai night market at golden hour sunset. Hundreds of colorful market stall tents — hot pink, yellow, blue, green, white — stretching across the frame. Camera moves forward and slowly descends, revealing the city skyline on the horizon bathed in warm amber sunset light. Motion blur on people moving between stalls far below, light streaks from scooters on surrounding roads. Vivid color saturation, every tent a different bold color. Cinematic drone movement, smooth and slow. Anamorphic, cinematic motion blur, 8K photorealistic, vibrant golden dusk.",
  },
  {
    filename: "03-chinatown.mp4",
    seedImagePath: path.join(SEED_DIR, "shutterstock_1082340641.jpg"),
    prompt:
      "Cinematic steady cam tracking shot moving forward through Bangkok Yaowarat Chinatown at full night. Street level, pushing forward through the neon-lit road. Red, orange, green and gold neon signs in Chinese and Thai script stacked on shophouse facades on both sides. Colorful Bangkok taxis — green, yellow, red — and tuk-tuks streaking past with motion blur, speed smear on passing vehicles. Overhead wires, blinking signs. Wet pavement reflecting the neon in vivid pools of color. Dense, alive, electric. Camera pushes forward, never stopping. Cinematic motion blur on traffic, long exposure feel. Cyberpunk Bangkok, 8K photorealistic, maximum saturation.",
  },
  {
    filename: "04-neon.mp4",
    seedImagePath: path.join(SEED_DIR, "83194242_498869771027865_391939905304808974_n.jpg"),
    prompt:
      "Cinematic low-angle tracking shot following a neon-painted Bangkok tuk-tuk through tight city streets at night. Electric blue and hot pink neon light reflects off the tuk-tuk's chrome and wet pavement below. Camera tracks alongside then pulls ahead, revealing a full neon canyon — building facades covered floor to rooftop in LED signs, electric cyan, magenta, neon red. Absolute night. Wet road like a mirror. Cyberpunk Bangkok aesthetic, Blade Runner energy. Camera moves steadily forward. 8K, anamorphic, hyper-vivid neon saturation, photorealistic.",
  },
  {
    filename: "05-nightmarket.mp4",
    seedImagePath: path.join(SEED_DIR, "shutterstock_303567251.jpg"),
    prompt:
      "Slow cinematic aerial arc over the Bangkok Asiatique Riverfront at night. The illuminated Ferris wheel glows white and blue. The Chao Phraya river fills the left side, with long-exposure boat light trails streaking and smearing across the dark water below. The city skyline blazes on the opposite bank. Camera moves forward slowly, tilting down toward the riverfront market and pier lights. Motion blur on boats crossing the river, light trails from river traffic. Orange and gold market lights below, deep blue-purple dramatic sky above. Epic cinematic scale. Cinematic motion blur, long exposure light trails, 8K photorealistic, anamorphic, night photography, vivid.",
  },
  {
    filename: "06-skyline.mp4",
    seedImagePath: path.join(SEED_DIR, "04 Unlock Epic Stays - The Temple of Dawn.png"),
    prompt:
      "Slow cinematic push-in toward Wat Arun Temple of Dawn, Bangkok, illuminated in warm amber and white light against a deep blue dusk sky. The Chao Phraya river reflects the temple's perfect golden reflection below, long-exposure ripples and light smear across the water's surface. Camera moves slowly and majestically forward, the prangs growing taller in frame. Motion blur on passing river boats leaving golden light trails across the water. Warm temple light against the deep blue sky creates a breathtaking contrast. City lights flicker in the background. Cinematic, reverent, epic. Cinematic motion blur, long exposure light trails on water, 8K photorealistic, anamorphic, dusk blue hour, golden temple light.",
  },
];

// ─── HTTP Helpers ────────────────────────────────────────────────────────────

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
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try { resolve(JSON.parse(buf)); }
          catch { reject(new Error(`Bad JSON: ${buf}`)); }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function getJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { Authorization: `Bearer ${API_KEY}`, "X-Runway-Version": "2024-11-06" } },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try { resolve(JSON.parse(buf)); }
          catch { reject(new Error(`Bad JSON: ${buf}`)); }
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
    const res = await getJson(url);
    process.stdout.write(`\r  polling… status=${res.status ?? "?"} (${i * 5}s)  `);
    if (res.status === "SUCCEEDED") {
      process.stdout.write("\n");
      return res.output?.[0] ?? res.artifacts?.[0]?.url;
    }
    if (res.status === "FAILED") throw new Error(`Task failed: ${JSON.stringify(res.error)}`);
  }
  throw new Error("Timed out after 10 minutes");
}

// ─── Image Helpers ────────────────────────────────────────────────────────────

// Resize any image to 1280×720 (center-crop to maintain 16:9) and return as base64 data URL
function imageToDataUrl(imagePath: string): string {
  const bin = ffmpegStatic!;
  const tempPath = path.join(OUT_DIR, "_seed_temp.jpg");
  execSync(
    `"${bin}" -y -i "${imagePath}" -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" -q:v 2 "${tempPath}"`,
    { stdio: "pipe" }
  );
  const base64 = fs.readFileSync(tempPath).toString("base64");
  fs.unlinkSync(tempPath);
  return `data:image/jpeg;base64,${base64}`;
}

// Extract the last frame of a video as a base64 data URL (used for fallback continuity)
function extractLastFrame(videoPath: string): string {
  const bin = ffmpegStatic!;
  const framePath = videoPath.replace(".mp4", "-lastframe.jpg");
  execSync(
    `"${bin}" -y -sseof -0.5 -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}"`,
    { stdio: "pipe" }
  );
  const base64 = fs.readFileSync(framePath).toString("base64");
  fs.unlinkSync(framePath);
  return `data:image/jpeg;base64,${base64}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log("🎬  Carnivore Digital — Streets of Bangkok");
  console.log(`    Output: ${OUT_DIR}`);
  if (FORCE) console.log("    ⚠️  FORCE mode — existing Bangkok videos will be overwritten.\n");
  else console.log("    Tip: set FORCE=1 to overwrite existing videos.\n");

  for (const chapter of CHAPTERS) {
    const dest = path.join(OUT_DIR, chapter.filename);

    if (fs.existsSync(dest) && !FORCE) {
      console.log(`  ✓ ${chapter.filename} already exists, skipping.`);
      continue;
    }

    if (fs.existsSync(dest) && FORCE) {
      fs.unlinkSync(dest);
    }

    console.log(`\n▶  Generating ${chapter.filename}…`);
    console.log(`  Seed: ${path.basename(chapter.seedImagePath)}`);

    if (!fs.existsSync(chapter.seedImagePath)) {
      throw new Error(`Seed image not found: ${chapter.seedImagePath}`);
    }

    const seedImage = imageToDataUrl(chapter.seedImagePath);
    console.log(`  Seed image encoded (${(seedImage.length / 1024).toFixed(0)} KB base64)`);

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

  console.log("\n✅  All 6 shots done.");
  console.log("    Run npm run dev to preview, then push public/videos/ to the repo.");
})();
