import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

async function test() {
  const outTest = path.resolve('public/test_frame_q90.webp');
  execSync(`"${ffmpeg.path}" -y -ss 00:00:00.100 -i videos/clip1.mp4 -vframes 1 -vf "scale=1920:1080" -c:v libwebp -quality 90 "${outTest}"`);
  
  const sOld = fs.statSync('public/frames/frame_0001.webp');
  const sNew = fs.statSync(outTest);
  
  console.log('Old frame 1 size:', (sOld.size / 1024).toFixed(1), 'KB');
  console.log('New frame 1 (native 1080p q90) size:', (sNew.size / 1024).toFixed(1), 'KB');
}

test().catch(console.error);
