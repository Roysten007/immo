import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import path from 'path';

try {
  const out = execSync(`"${ffmpeg.path}" -i "${path.resolve('videos/clip1.mp4')}"`, { encoding: 'utf-8' });
  console.log(out);
} catch (e) {
  console.log(e.stderr || e.stdout);
}
