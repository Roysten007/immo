import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const FFMPEG = `"${ffmpeg.path}"`;
const VIDEOS_DIR = path.resolve('videos');
const PUBLIC_DIR = path.resolve('public');
const FRAMES_DESKTOP_DIR = path.join(PUBLIC_DIR, 'frames');
const FRAMES_MOBILE_DIR = path.join(PUBLIC_DIR, 'frames-mobile');
const COMBINED_VIDEO = path.join(VIDEOS_DIR, 'combined.mp4');

// Ensure directories exist
fs.mkdirSync(FRAMES_DESKTOP_DIR, { recursive: true });
fs.mkdirSync(FRAMES_MOBILE_DIR, { recursive: true });

async function run() {
  console.log('=== ÉTAPE 1 : INSPECTION DES CLIPS ET CONCATÉNATION ===');
  
  const clips = [
    'clip1.mp4',
    'clip2.mp4',
    'clip3.mp4',
    'clip4.mp4',
    'clip5.mp4',
    'clip6.mp4',
    'clip7.mp4',
    'clip8.mp4',
    'clip9.mp4'
  ];

  for (const clip of clips) {
    const p = path.join(VIDEOS_DIR, clip);
    if (!fs.existsSync(p)) {
      throw new Error(`Fichier introuvable : ${p}`);
    }
    const stat = fs.statSync(p);
    console.log(`- ${clip}: ${(stat.size / 1024 / 1024).toFixed(2)} Mo`);
  }

  // Création du fichier concat_list.txt pour ffmpeg concat demuxer
  const concatListPath = path.join(VIDEOS_DIR, 'concat_list.txt');
  const concatContent = clips.map(c => `file '${path.join(VIDEOS_DIR, c).replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatListPath, concatContent);

  console.log('\nConcaténation en cours vers combined.mp4...');
  try {
    // Essai rapide concat copy
    execSync(`${FFMPEG} -y -f concat -safe 0 -i "${concatListPath}" -c copy "${COMBINED_VIDEO}"`, { stdio: 'inherit' });
    console.log('Concaténation directe réussie !');
  } catch (err) {
    console.warn('Concaténation -c copy échouée, ré-encodage avec filtre concat...');
    // Fallback avec ré-encodage si les paramètres d'encodage diffèrent
    const inputs = clips.map(c => `-i "${path.join(VIDEOS_DIR, c)}"`).join(' ');
    const filter = clips.map((_, i) => `[${i}:v:0]`).join('') + `concat=n=${clips.length}:v=1:a=0[outv]`;
    execSync(`${FFMPEG} -y ${inputs} -filter_complex "${filter}" -map "[outv]" -c:v libx264 -preset fast -crf 20 "${COMBINED_VIDEO}"`, { stdio: 'inherit' });
  }

  const combinedStat = fs.statSync(COMBINED_VIDEO);
  console.log(`Vidéo combinée créée : ${(combinedStat.size / 1024 / 1024).toFixed(2)} Mo`);

  console.log('\n=== ÉTAPE 2 : EXTRACTION DES FRAMES DESKTOP ===');
  console.log('fps=15, scale=1600:-2, WebP qualité 75...');
  // Nettoyage préalable des frames existantes
  for (const f of fs.readdirSync(FRAMES_DESKTOP_DIR)) {
    if (f.endsWith('.webp')) fs.unlinkSync(path.join(FRAMES_DESKTOP_DIR, f));
  }
  
  const desktopPattern = path.join(FRAMES_DESKTOP_DIR, 'frame_%04d.webp');
  execSync(`${FFMPEG} -y -i "${COMBINED_VIDEO}" -vf "fps=15,scale=1600:-2" -c:v libwebp -quality 75 "${desktopPattern}"`, { stdio: 'inherit' });

  console.log('\n=== ÉTAPE 3 : EXTRACTION DES FRAMES MOBILE ===');
  console.log('fps=8, scale=800:-2, WebP qualité 70...');
  for (const f of fs.readdirSync(FRAMES_MOBILE_DIR)) {
    if (f.endsWith('.webp')) fs.unlinkSync(path.join(FRAMES_MOBILE_DIR, f));
  }
  
  const mobilePattern = path.join(FRAMES_MOBILE_DIR, 'frame_%04d.webp');
  execSync(`${FFMPEG} -y -i "${COMBINED_VIDEO}" -vf "fps=8,scale=800:-2" -c:v libwebp -quality 70 "${mobilePattern}"`, { stdio: 'inherit' });

  console.log('\n=== ÉTAPE 4 : CONTRÔLE DE POIDS ET RECOMPRESSION SI NÉCESSAIRE ===');

  // Desktop check (< 60 Ko)
  const desktopFiles = fs.readdirSync(FRAMES_DESKTOP_DIR).filter(f => f.endsWith('.webp')).sort();
  console.log(`Frames Desktop trouvées : ${desktopFiles.length}`);
  let desktopRecompressed = 0;
  let totalDesktopBytes = 0;

  for (const file of desktopFiles) {
    const filePath = path.join(FRAMES_DESKTOP_DIR, file);
    let stat = fs.statSync(filePath);
    if (stat.size > 60 * 1024) {
      // Recompresser avec Sharp
      let q = 70;
      let buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      while (buffer.length > 60 * 1024 && q > 40) {
        q -= 5;
        buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      }
      fs.writeFileSync(filePath, buffer);
      desktopRecompressed++;
      stat = fs.statSync(filePath);
    }
    totalDesktopBytes += stat.size;
  }
  console.log(`Desktop : ${desktopFiles.length} frames, ${desktopRecompressed} recompressées.`);
  console.log(`Poids total dossier Desktop : ${(totalDesktopBytes / 1024 / 1024).toFixed(2)} Mo (Moyenne : ${(totalDesktopBytes / desktopFiles.length / 1024).toFixed(1)} Ko/frame)`);

  // Mobile check (< 30 Ko)
  const mobileFiles = fs.readdirSync(FRAMES_MOBILE_DIR).filter(f => f.endsWith('.webp')).sort();
  console.log(`\nFrames Mobile trouvées : ${mobileFiles.length}`);
  let mobileRecompressed = 0;
  let totalMobileBytes = 0;

  for (const file of mobileFiles) {
    const filePath = path.join(FRAMES_MOBILE_DIR, file);
    let stat = fs.statSync(filePath);
    if (stat.size > 30 * 1024) {
      let q = 65;
      let buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      while (buffer.length > 30 * 1024 && q > 35) {
        q -= 5;
        buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      }
      fs.writeFileSync(filePath, buffer);
      mobileRecompressed++;
      stat = fs.statSync(filePath);
    }
    totalMobileBytes += stat.size;
  }
  console.log(`Mobile : ${mobileFiles.length} frames, ${mobileRecompressed} recompressées.`);
  console.log(`Poids total dossier Mobile : ${(totalMobileBytes / 1024 / 1024).toFixed(2)} Mo (Moyenne : ${(totalMobileBytes / mobileFiles.length / 1024).toFixed(1)} Ko/frame)`);

  console.log('\n=== ÉTAPE 5 : GÉNÉRATION DE public/fallback.webp ===');
  const fallbackPath = path.join(PUBLIC_DIR, 'fallback.webp');
  if (desktopFiles.length > 0) {
    const firstFrame = path.join(FRAMES_DESKTOP_DIR, desktopFiles[0]);
    await sharp(firstFrame).webp({ quality: 85 }).toFile(fallbackPath);
    const fbStat = fs.statSync(fallbackPath);
    console.log(`fallback.webp généré (${(fbStat.size / 1024).toFixed(1)} Ko) depuis ${desktopFiles[0]}`);
  }

  // Enregistrer le manifeste JSON pour l'application frontend
  const manifest = {
    desktop: {
      count: desktopFiles.length,
      fps: 15,
      totalBytes: totalDesktopBytes,
      totalSizeMB: (totalDesktopBytes / 1024 / 1024).toFixed(2),
      avgKB: (totalDesktopBytes / desktopFiles.length / 1024).toFixed(1)
    },
    mobile: {
      count: mobileFiles.length,
      fps: 8,
      totalBytes: totalMobileBytes,
      totalSizeMB: (totalMobileBytes / 1024 / 1024).toFixed(2),
      avgKB: (totalMobileBytes / mobileFiles.length / 1024).toFixed(1)
    }
  };
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sequence-meta.json'), JSON.stringify(manifest, null, 2));
  console.log('\nManifeste sequence-meta.json écrit avec succès !');
  console.log('\n=== PIPELINE TERMINÉ AVEC SUCCÈS ===');
}

run().catch(err => {
  console.error('Erreur dans le pipeline :', err);
  process.exit(1);
});
