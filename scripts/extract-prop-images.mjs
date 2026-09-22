import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const FRAMES_DIR = path.resolve('public/frames');
const PROP_DIR = path.resolve('public/properties');

fs.mkdirSync(PROP_DIR, { recursive: true });

async function extractPropertyImages() {
  const frames = fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.webp')).sort();
  if (frames.length === 0) return;

  // Choisir 4 frames emblématiques réparties dans la visite
  // Frame ~50 (Façade extérieure)
  const f1 = path.join(FRAMES_DIR, frames[Math.floor(frames.length * 0.05)]);
  // Frame ~350 (Salon moderne)
  const f2 = path.join(FRAMES_DIR, frames[Math.floor(frames.length * 0.28)]);
  // Frame ~750 (Suite parentale)
  const f3 = path.join(FRAMES_DIR, frames[Math.floor(frames.length * 0.58)]);
  // Frame ~1250 (Terrasse & piscine nocturne)
  const f4 = path.join(FRAMES_DIR, frames[Math.floor(frames.length * 0.92)]);

  await sharp(f1).webp({ quality: 85 }).toFile(path.join(PROP_DIR, 'prop-elysee.webp'));
  await sharp(f2).webp({ quality: 85 }).toFile(path.join(PROP_DIR, 'prop-belvedere.webp'));
  await sharp(f3).webp({ quality: 85 }).toFile(path.join(PROP_DIR, 'prop-acacia.webp'));
  await sharp(f4).webp({ quality: 85 }).toFile(path.join(PROP_DIR, 'prop-lumina.webp'));

  console.log('4 images de propriétés extraites avec succès dans public/properties/ !');
}

extractPropertyImages().catch(console.error);
