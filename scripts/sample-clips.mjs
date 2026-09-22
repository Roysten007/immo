import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

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

const outDir = path.resolve('scratch/clip-samples');
fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < clips.length; i++) {
  const c = clips[i];
  const inP = path.resolve('videos', c);
  const outP = path.join(outDir, `sample_${c}.jpg`);
  // Extract frame at 5 seconds (middle of each clip)
  execSync(`"${ffmpeg.path}" -y -ss 00:00:05.000 -i "${inP}" -frames:v 1 -q:v 2 "${outP}"`, { stdio: 'inherit' });
  console.log(`Extracted sample for ${c} -> ${outP}`);
}
