import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import path from 'path';

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

let totalDurationSec = 0;
const clipStats = [];

for (const clip of clips) {
  const p = path.resolve('videos', clip);
  let durSec = 0;
  let out = '';
  try {
    execSync(`"${ffmpeg.path}" -i "${p}"`);
  } catch (e) {
    out = (e.output ? e.output.map(b => b ? b.toString() : '').join('\n') : '') + (e.stderr ? e.stderr.toString() : '');
  }

  const m = out.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
  if (m) {
    durSec = parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseFloat(m[3]);
  }
  clipStats.push({ clip, durSec });
  totalDurationSec += durSec;
}

console.log('=== STATS DES CLIPS ===');
let cumulativeSec = 0;
const results = [];
for (let i = 0; i < clipStats.length; i++) {
  const s = clipStats[i];
  const startSec = cumulativeSec;
  cumulativeSec += s.durSec;
  const startPct = startSec / totalDurationSec;
  const endPct = cumulativeSec / totalDurationSec;
  results.push({
    clip: s.clip,
    duration: s.durSec,
    startPct: parseFloat(startPct.toFixed(4)),
    endPct: parseFloat(endPct.toFixed(4)),
    rangeStr: `${(startPct * 100).toFixed(1)}% -> ${(endPct * 100).toFixed(1)}%`
  });
  console.log(`${s.clip}: ${s.durSec.toFixed(2)}s | Progrès: ${(startPct * 100).toFixed(1)}% -> ${(endPct * 100).toFixed(1)}%`);
}
console.log(`Durée totale: ${totalDurationSec.toFixed(2)}s`);
