import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = path.resolve('C:/Users/ADMIN/.gemini/antigravity-ide/brain/bcf9a358-5498-4432-a4eb-df9b8af7baf7');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const scrollHeight = await page.evaluate(() => {
    const el = document.getElementById('visite');
    return el ? el.offsetHeight - window.innerHeight : 0;
  });

  // Check 3.12 / 9 (Start of Chapter 4 - Cuisine with Island)
  await page.evaluate((y) => window.scrollTo(0, y), scrollHeight * (3.12 / 9));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_ch04_island.png') });

  // Check 4.5 / 9 (Chapter 5 - Stairs up to suite with bed)
  await page.evaluate((y) => window.scrollTo(0, y), scrollHeight * (4.5 / 9));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_ch05_bed_suite.png') });

  // Check 2.2 / 9 (Chapter 3 - Grand Salon)
  await page.evaluate((y) => window.scrollTo(0, y), scrollHeight * (2.2 / 9));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_ch03_salon.png') });

  // Check 5.5 / 9 (Chapter 6 - Spa / Baignoire)
  await page.evaluate((y) => window.scrollTo(0, y), scrollHeight * (5.5 / 9));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_ch06_spa.png') });

  // Check 7.5 / 9 (Chapter 8 - Terrasse / Belvédère)
  await page.evaluate((y) => window.scrollTo(0, y), scrollHeight * (7.5 / 9));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_ch08_terrasse.png') });

  await browser.close();
  console.log('All sample screenshots saved!');
})();
