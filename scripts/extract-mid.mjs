import { execSync } from 'child_process';
import path from 'path';

for (let i = 1; i <= 9; i++) {
  const cmd = `ffmpeg -ss 00:00:05 -i videos/clip${i}.mp4 -vframes 1 -q:v 2 scratch/clip-samples/mid_clip${i}.jpg -y`;
  console.log(`Extracting mid frame for clip ${i}...`);
  execSync(cmd, { stdio: 'inherit' });
}
console.log('All 9 mid frames extracted.');
