import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const srcDir = path.join(rootDir, "src");

console.log("🔍 Checking all local media and music assets referenced across the codebase...");

/**
 * Recursively retrieves all source and catalog files to scan.
 */
function getSourceFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        results = results.concat(getSourceFiles(fullPath));
      }
    } else if (/\.(tsx?|jsx?|json|css|mjs|cjs)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

const filesToScan = [
  ...getSourceFiles(srcDir),
  path.join(rootDir, "next.config.ts"),
].filter((f) => fs.existsSync(f));

// Regex matching local asset paths beginning with /media/ or /music/
// Negative lookbehind ensures we never match remote URLs (http://, https://, protocol-relative //)
const ASSET_REGEX = /(?<!https?:)(?<!\/\/)\/(media|music)\/[a-zA-Z0-9_\-./%]+\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|mov|mp3|wav|ogg|m4a|aac)/gi;

// Map: assetPath -> Set of source files referencing it
const referencedAssets = new Map();

for (const filePath of filesToScan) {
  const content = fs.readFileSync(filePath, "utf-8");
  const matches = content.match(ASSET_REGEX);
  if (matches) {
    for (const rawMatch of matches) {
      // Clean query parameters or hash anchors if present
      const cleanMatch = rawMatch.split("?")[0].split("#")[0];
      const relSource = path.relative(rootDir, filePath);
      if (!referencedAssets.has(cleanMatch)) {
        referencedAssets.set(cleanMatch, new Set());
      }
      referencedAssets.get(cleanMatch).add(relSource);
    }
  }
}

let missingCount = 0;
const missingAssets = [];

for (const [assetPath, sources] of referencedAssets.entries()) {
  // Strip leading slash to resolve inside public/
  const relPath = assetPath.replace(/^\//, "");
  const diskPath = path.join(publicDir, relPath);

  if (!fs.existsSync(diskPath)) {
    missingCount++;
    missingAssets.push({
      assetPath,
      diskPath,
      sources: Array.from(sources),
    });
  }
}

console.log(`📁 Scanned ${filesToScan.length} source/config/catalog files.`);
console.log(`🔗 Found ${referencedAssets.size} unique local /media and /music asset references.`);

if (missingCount > 0) {
  console.error(`\n❌ ASSET VERIFICATION FAILED: ${missingCount} missing file(s) detected:`);
  for (const item of missingAssets) {
    console.error(`  - ${item.assetPath}`);
    console.error(`    Expected at: ${item.diskPath}`);
    console.error(`    Referenced in: ${item.sources.join(", ")}`);
  }
  process.exit(1);
} else {
  console.log(`✅ All ${referencedAssets.size} referenced assets verified successfully on disk!`);
  process.exit(0);
}
