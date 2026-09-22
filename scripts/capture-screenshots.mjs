import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = path.resolve(
  'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a5c03b14-7b46-4f98-94af-a9331ea809ca'
);
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runCapture() {
  console.log('=== LANCEMENT DU TEST NAVIGATEUR EDGE HEADLESS ===');
  
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  
  // Collecter les erreurs console
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('[Browser Error]', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
    console.error('[Page Exception]', err.message);
  });

  console.log('\n1. Navigation vers http://localhost:5173/...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Attente du chargement initial
  await page.waitForFunction(() => {
    const loader = document.querySelector('.bg-\\[\\#0F0E0C\\].animate-pulse');
    return !loader;
  }, { timeout: 15000 }).catch(() => console.log('Loader déjà masqué'));

  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture Chapitre 01 : Façade
  console.log('Capture 1: Façade (Chapitre 01)...');
  const shot1 = path.join(ARTIFACT_DIR, '01_facade_arrival.png');
  await page.screenshot({ path: shot1 });

  // 2. Scroll vers Chapitre 04 : Cuisine & Espace Culinaire (clip 4: 3/9 à 4/9, test à ~3.5/9)
  console.log('Capture 2: Cuisine d\'Architecte (Chapitre 04)...');
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * (3.5 / 9), behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  const shot2 = path.join(ARTIFACT_DIR, '02_kitchen_culinary.png');
  await page.screenshot({ path: shot2 });

  // 3. Scroll vers Chapitre 05 : Montée vers l'Étage Nuit (clip 5: 4/9 à 5/9, test à ~4.5/9)
  console.log('Capture 3: Montée Privative & Étage Nuit (Chapitre 05)...');
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * (4.5 / 9), behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  const shot3 = path.join(ARTIFACT_DIR, '03_stairs_master.png');
  await page.screenshot({ path: shot3 });

  // 4. Scroll vers Chapitre 09 : Sunset & Piscine (clip 9: 8/9 à 1.0, test à ~8.6/9)
  console.log('Capture 4: Piscine Miroir & Sunset (Chapitre 09)...');
  await page.evaluate(() => {
    const el = document.getElementById('visite');
    if (el) {
      const maxScroll = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * (8.6 / 9), behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  const shotSunset = path.join(ARTIFACT_DIR, '03_sunset_pool.png');
  await page.screenshot({ path: shotSunset });

  // 5. Scroll vers Biens d'exception (Redesign)
  console.log('Capture 5: Collection de biens d\'exception (Redesign)...');
  await page.evaluate(() => {
    const el = document.getElementById('biens');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  const shot4 = path.join(ARTIFACT_DIR, '04_featured_properties.png');
  await page.screenshot({ path: shot4 });

  // 6. Clic sur le bouton "Dossier" de la première propriété pour vérifier la modal
  console.log('Capture 6: Modal de dossier confidentiel...');
  await page.evaluate(() => {
    const btn = document.querySelector('article button');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  const shotModal = path.join(ARTIFACT_DIR, '05_property_modal.png');
  await page.screenshot({ path: shotModal });

  // Fermer la modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.fixed.inset-0 button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Test Responsive : 768px (Tablette)
  console.log('\n=== TEST RESPONSIVE TABLETTE (768px) ===');
  await page.setViewport({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  const shotTablet = path.join(ARTIFACT_DIR, '07_tablet_768px.png');
  await page.screenshot({ path: shotTablet });

  // Test Responsive : 390px (Mobile iPhone)
  console.log('\n=== TEST RESPONSIVE MOBILE (390px) ===');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  const shotMobile = path.join(ARTIFACT_DIR, '08_mobile_390px.png');
  await page.screenshot({ path: shotMobile });

  // Mobile Properties Section
  await page.evaluate(() => {
    const el = document.getElementById('biens');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  const shotMobileProps = path.join(ARTIFACT_DIR, '09_mobile_properties.png');
  await page.screenshot({ path: shotMobileProps });

  // Vérification des débordements horizontaux
  const overflowCheck = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Débordement horizontal sur mobile (390px) : ${overflowCheck ? 'OUI (A corriger)' : 'NON (Parfait)'}`);

  await browser.close();

  console.log('\n=== BILAN DES ERREURS CONSOLE ===');
  console.log(`Nombre d'erreurs console détectées : ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Erreurs :', consoleErrors);
  } else {
    console.log('Aucune erreur JavaScript détectée !');
  }

  console.log('\n=== CAPTURES D\'ÉCRAN RÉUSSIES DANS L\'ARTIFACT DIR ===');
  console.log('- ' + shot1);
  console.log('- ' + shot2);
  console.log('- ' + shot3);
  console.log('- ' + shotSunset);
  console.log('- ' + shot4);
  console.log('- ' + shotModal);
  console.log('- ' + shotTablet);
  console.log('- ' + shotMobile);
  console.log('- ' + shotMobileProps);
}

runCapture().catch((err) => {
  console.error('Erreur lors de la capture :', err);
  process.exit(1);
});
