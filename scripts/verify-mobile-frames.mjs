import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = path.resolve(
  'C:/Users/ADMIN/.gemini/antigravity-ide/brain/bcf9a358-5498-4432-a4eb-df9b8af7baf7'
);
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runMobileCapture() {
  console.log('=== TEST & CAPTURES MOBILE 390px (VIEWPORT IPHONE 390x844) ===');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log('Navigation vers http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // Attendre que le loader disparaisse
  await page.waitForFunction(() => {
    const loader = document.querySelector('.bg-\\[\\#0F0E0C\\].animate-pulse');
    return !loader;
  }, { timeout: 12000 }).catch(() => console.log('Loader déjà masqué'));

  await new Promise(r => setTimeout(r, 1500));

  // 1. Capture Chapitre 01 : Façade d'arrivée
  console.log('Capture 1: Chapitre 01 - Façade...');
  const shot1 = path.join(ARTIFACT_DIR, 'mobile_ch01_facade.png');
  await page.screenshot({ path: shot1 });

  // 2. Scroll vers Chapitre 04 : Cuisine & Espace Repas (clip 4: ~3.5/9)
  console.log('Capture 2: Chapitre 04 - Cuisine & Îlot...');
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * (3.5 / 9), behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot2 = path.join(ARTIFACT_DIR, 'mobile_ch04_cuisine.png');
  await page.screenshot({ path: shot2 });

  // 3. Scroll vers Chapitre 07 : Master Suite & Lit (clip 7: ~6.5/9)
  console.log('Capture 3: Chapitre 07 - Master Suite & Lit...');
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * (6.5 / 9), behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot3 = path.join(ARTIFACT_DIR, 'mobile_ch07_master_suite.png');
  await page.screenshot({ path: shot3 });

  // 4. Scroll vers Chapitre 09 : Crépuscule & Piscine miroir (clip 9: ~8.8/9)
  console.log('Capture 4: Chapitre 09 - Crépuscule, Piscine & CTAs...');
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * (8.8 / 9), behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot4 = path.join(ARTIFACT_DIR, 'mobile_ch09_piscine_sunset.png');
  await page.screenshot({ path: shot4 });

  console.log('Captures terminées avec succès dans l\'artifact dir !');
  await browser.close();
}

runMobileCapture().catch(console.error);
