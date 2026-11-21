import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

console.log("🔍 Checking all media and audio assets in harleen-birthday...");

const filesToCheck = [
  path.join(rootDir, "src/data/mediaCatalog.ts"),
  path.join(rootDir, "src/data/config.ts"),
  path.join(rootDir, "src/components/StartGate.tsx"),
  path.join(rootDir, "src/components/Hero3D.tsx"),
  path.join(rootDir, "src/components/BirthdayCakeCeremony.tsx"),
  path.join(rootDir, "src/components/PhotoScrollReveal.tsx"),
  path.join(rootDir, "src/components/MidnightVault.tsx"),
  path.join(rootDir, "src/components/ScrollyPopups.tsx"),
];

const referencedAssets = new Set();
const assetRegex = /\/(media|music)\/[a-zA-Z0-9_\-.]+\.(jpg|jpeg|png|webp|mp4|mp3|webm|svg)/g;

for (const filePath of filesToCheck) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    const matches = content.match(assetRegex);
    if (matches) {
      for (const m of matches) {
        referencedAssets.add(m);
      }
    }
  }
}

let missingCount = 0;
for (const assetPath of referencedAssets) {
  const diskPath = path.join(publicDir, assetPath.replace(/^\//, ""));
  if (!fs.existsSync(diskPath)) {
    console.error(`❌ MISSING ASSET: ${assetPath} (expected at ${diskPath})`);
    missingCount++;
  }
}

if (missingCount === 0) {
  console.log(`✅ All ${referencedAssets.size} referenced assets verified successfully on disk!`);
} else {
  console.error(`❌ Total missing assets: ${missingCount}`);
  process.exit(1);
}
