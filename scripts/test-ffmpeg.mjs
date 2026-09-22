import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import sharp from 'sharp';

console.log('FFmpeg path:', ffmpeg.path);
try {
  const version = execSync(`"${ffmpeg.path}" -version`).toString();
  console.log('FFmpeg Version:\n', version.split('\n')[0]);
  const encoders = execSync(`"${ffmpeg.path}" -encoders`).toString();
  console.log('Has libwebp encoder?', encoders.includes('libwebp'));
} catch (e) {
  console.error('Error running ffmpeg:', e.message);
}

console.log('Sharp available:', typeof sharp);
