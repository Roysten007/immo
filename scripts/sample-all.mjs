import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import path from 'path';

for (let i = 1; i <= 9; i++) {
  const out = path.resolve(`public/sample_clip_${i}.webp`);
  try {
    execSync(`"${ffmpeg.path}" -y -ss 00:00:01.000 -i "videos/clip${i}.mp4" -vframes 1 -vf "scale=960:540" "${out}"`);
    console.log(`Clip ${i} extracted`);
  } catch (e) {
    console.error(`Clip ${i} error`, e.message);
  }
}
