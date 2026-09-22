import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Désactiver le cache Sharp pour éviter les verrous de fichiers sous Windows
sharp.cache(false);

const PUBLIC_DIR = path.resolve('public');
const FRAMES_DESKTOP_DIR = path.join(PUBLIC_DIR, 'frames');
const FRAMES_MOBILE_DIR = path.join(PUBLIC_DIR, 'frames-mobile');

async function processOptimization() {
  console.log('=== VÉRIFICATION DU POIDS DES FRAMES ===');

  // Desktop
  const desktopFiles = fs.readdirSync(FRAMES_DESKTOP_DIR).filter(f => f.endsWith('.webp')).sort();
  console.log(`Frames Desktop : ${desktopFiles.length}`);

  let desktopRecompressed = 0;
  let totalDesktopBytes = 0;
  let maxDesktopSize = 0;

  for (const file of desktopFiles) {
    const filePath = path.join(FRAMES_DESKTOP_DIR, file);
    let stat = fs.statSync(filePath);
    
    if (stat.size > 60 * 1024) {
      let q = 70;
      let buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      while (buffer.length > 60 * 1024 && q > 35) {
        q -= 5;
        buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      }
      const tmpPath = filePath + '.tmp';
      fs.writeFileSync(tmpPath, buffer);
      fs.unlinkSync(filePath);
      fs.renameSync(tmpPath, filePath);
      desktopRecompressed++;
      stat = fs.statSync(filePath);
    }
    
    if (stat.size > maxDesktopSize) maxDesktopSize = stat.size;
    totalDesktopBytes += stat.size;
  }

  console.log(`Desktop : ${desktopFiles.length} frames`);
  console.log(`- Frames recompressées (<60 Ko) : ${desktopRecompressed}`);
  console.log(`- Poids max frame : ${(maxDesktopSize / 1024).toFixed(1)} Ko`);
  console.log(`- Poids total dossier Desktop : ${(totalDesktopBytes / 1024 / 1024).toFixed(2)} Mo`);
  console.log(`- Poids moyen : ${(totalDesktopBytes / desktopFiles.length / 1024).toFixed(1)} Ko/frame`);

  // Mobile
  const mobileFiles = fs.readdirSync(FRAMES_MOBILE_DIR).filter(f => f.endsWith('.webp')).sort();
  console.log(`\nFrames Mobile : ${mobileFiles.length}`);

  let mobileRecompressed = 0;
  let totalMobileBytes = 0;
  let maxMobileSize = 0;

  for (const file of mobileFiles) {
    const filePath = path.join(FRAMES_MOBILE_DIR, file);
    let stat = fs.statSync(filePath);

    if (stat.size > 30 * 1024) {
      let q = 65;
      let buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      while (buffer.length > 30 * 1024 && q > 30) {
        q -= 5;
        buffer = await sharp(filePath).webp({ quality: q }).toBuffer();
      }
      const tmpPath = filePath + '.tmp';
      fs.writeFileSync(tmpPath, buffer);
      fs.unlinkSync(filePath);
      fs.renameSync(tmpPath, filePath);
      mobileRecompressed++;
      stat = fs.statSync(filePath);
    }

    if (stat.size > maxMobileSize) maxMobileSize = stat.size;
    totalMobileBytes += stat.size;
  }

  console.log(`Mobile : ${mobileFiles.length} frames`);
  console.log(`- Frames recompressées (<30 Ko) : ${mobileRecompressed}`);
  console.log(`- Poids max frame : ${(maxMobileSize / 1024).toFixed(1)} Ko`);
  console.log(`- Poids total dossier Mobile : ${(totalMobileBytes / 1024 / 1024).toFixed(2)} Mo`);
  console.log(`- Poids moyen : ${(totalMobileBytes / mobileFiles.length / 1024).toFixed(1)} Ko/frame`);

  // Fallback
  console.log('\n=== CRÉATION DE public/fallback.webp ===');
  const fallbackPath = path.join(PUBLIC_DIR, 'fallback.webp');
  if (desktopFiles.length > 0) {
    const firstFrame = path.join(FRAMES_DESKTOP_DIR, desktopFiles[0]);
    await sharp(firstFrame).webp({ quality: 80 }).toFile(fallbackPath);
    const fbStat = fs.statSync(fallbackPath);
    console.log(`fallback.webp créé avec succès (${(fbStat.size / 1024).toFixed(1)} Ko) !`);
  }

  // Manifeste
  const manifest = {
    desktop: {
      count: desktopFiles.length,
      fps: 15,
      totalBytes: totalDesktopBytes,
      totalSizeMB: (totalDesktopBytes / 1024 / 1024).toFixed(2),
      avgKB: (totalDesktopBytes / desktopFiles.length / 1024).toFixed(1),
      maxKB: (maxDesktopSize / 1024).toFixed(1)
    },
    mobile: {
      count: mobileFiles.length,
      fps: 8,
      totalBytes: totalMobileBytes,
      totalSizeMB: (totalMobileBytes / 1024 / 1024).toFixed(2),
      avgKB: (totalMobileBytes / mobileFiles.length / 1024).toFixed(1),
      maxKB: (maxMobileSize / 1024).toFixed(1)
    }
  };

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sequence-meta.json'), JSON.stringify(manifest, null, 2));
  console.log('Manifeste sequence-meta.json écrit avec succès !');
}

processOptimization().catch(console.error);
