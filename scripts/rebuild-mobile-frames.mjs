import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const COMBINED_VIDEO = path.resolve('videos/combined.mp4');
const FRAMES_MOBILE_DIR = path.resolve('public/frames-mobile');
const META_PATH = path.resolve('public/sequence-meta.json');

console.log('=== EXTRACTION DES FRAMES PORTRAIT HAUTE DÉFINITION POUR MOBILE ===');
console.log('Paramètres : fps=8, crop=608:1080 (centré), scale=720:1280 (portrait 9:16), WebP qualité 72');

// 1. Vider le dossier existant
if (!fs.existsSync(FRAMES_MOBILE_DIR)) {
  fs.mkdirSync(FRAMES_MOBILE_DIR, { recursive: true });
} else {
  for (const f of fs.readdirSync(FRAMES_MOBILE_DIR)) {
    if (f.endsWith('.webp')) {
      fs.unlinkSync(path.join(FRAMES_MOBILE_DIR, f));
    }
  }
}

// 2. Extraire la séquence portrait 720x1280
const pattern = path.join(FRAMES_MOBILE_DIR, 'frame_%04d.webp');
const t0 = Date.now();

execSync(
  `"${ffmpeg.path}" -y -i "${COMBINED_VIDEO}" -vf "fps=8,crop=608:1080:(in_w-608)/2:0,scale=720:1280" -c:v libwebp -quality 72 "${pattern}"`,
  { stdio: 'inherit' }
);

const t1 = Date.now();
const files = fs.readdirSync(FRAMES_MOBILE_DIR).filter((f) => f.endsWith('.webp')).sort();
let totalBytes = 0;
let maxBytes = 0;

for (const f of files) {
  const stat = fs.statSync(path.join(FRAMES_MOBILE_DIR, f));
  totalBytes += stat.size;
  if (stat.size > maxBytes) maxBytes = stat.size;
}

const avgKB = files.length > 0 ? (totalBytes / files.length / 1024).toFixed(1) : '0';
const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
const maxKB = (maxBytes / 1024).toFixed(1);

console.log(`\n=== EXTRACTION TERMINÉE EN ${((t1 - t0) / 1000).toFixed(1)}s ===`);
console.log(`Total frames : ${files.length}`);
console.log(`Poids total : ${totalMB} Mo`);
console.log(`Poids moyen par frame : ${avgKB} Ko`);
console.log(`Poids max : ${maxKB} Ko`);

// 3. Mettre à jour sequence-meta.json
let meta = {};
try {
  meta = JSON.parse(fs.readFileSync(META_PATH, 'utf-8'));
} catch (e) {
  meta = {};
}

meta.mobile = {
  count: files.length,
  totalBytes,
  totalSizeMB: totalMB,
  avgKB,
  maxKB,
  fps: 8,
  width: 720,
  height: 1280
};

fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2), 'utf-8');
console.log('sequence-meta.json mis à jour avec succès !');
