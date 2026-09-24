import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = path.resolve('C:/Users/ADMIN/.gemini/antigravity-ide/brain/a75c9465-a7c4-45af-9998-ce5365cca2d7');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('=== DIAGNOSTIC VISUEL MOBILE (iPhone 14 / DPR 3) ===');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[ERROR] ${err.message}`));

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  // Diagnostic sur le Canvas
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'No canvas found' };
    const rect = canvas.getBoundingClientRect();
    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight,
      rectWidth: rect.width,
      rectHeight: rect.height,
      windowDpr: window.devicePixelRatio,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  });
  console.log('Canvas diagnostic info:', canvasInfo);

  // Capture 1: Hero mobile top (Ch 01)
  const shotHero = path.join(ARTIFACT_DIR, 'new_diag_mobile_hero.png');
  await page.screenshot({ path: shotHero });
  console.log('Saved hero screenshot to:', shotHero);

  // Scroll into Chapter 03 (Living Room, ~25% scroll of #visite)
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      window.scrollTo({ top: el.offsetHeight * 0.25, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const shotCh03 = path.join(ARTIFACT_DIR, 'new_diag_mobile_ch03.png');
  await page.screenshot({ path: shotCh03 });
  console.log('Saved Chapter 03 to:', shotCh03);

  // Scroll into Chapter 09 (Sunset pool, ~92% scroll of #visite)
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      window.scrollTo({ top: el.offsetHeight * 0.92, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const shotCh09 = path.join(ARTIFACT_DIR, 'new_diag_mobile_ch09.png');
  await page.screenshot({ path: shotCh09 });
  console.log('Saved Chapter 09 to:', shotCh09);

  console.log('\nConsole logs:', consoleLogs.slice(-10));
  await browser.close();
}

run().catch(console.error);
