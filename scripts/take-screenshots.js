/* eslint-disable */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || 'before';
const outDir = path.join(__dirname, '..', 'design-review', targetDir);

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const widths = [360, 768, 1280];

async function run() {
  const browser = await chromium.launch({
    executablePath: '/home/artemis/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  for (const width of widths) {
    console.log(`Taking ${targetDir} screenshots at ${width}px...`);
    const page = await browser.newPage({
      viewport: { width, height: 900 }
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Capture StartGate
    const gate = await page.$('[role="dialog"]');
    if (gate) {
      await gate.screenshot({ path: path.join(outDir, `00-startgate-${width}px.png`) });
      // Dismiss StartGate
      const enterBtn = await page.$('button:has-text("Enter"), button:has-text("Step Into")');
      if (enterBtn) {
        await enterBtn.click();
      } else {
        await gate.click();
      }
      await page.waitForTimeout(1000);
    }

    // 2. Fullpage screenshot
    await page.screenshot({
      path: path.join(outDir, `00-fullpage-${width}px.png`),
      fullPage: true
    });

    // 3. Section by section screenshots
    const sections = [
      { name: '01-header', selector: 'header' },
      { name: '02-hero', selector: 'main > section:first-of-type, [class*="perspective"]' },
      { name: '03-cake', selector: '#cake-ceremony, [id*="cake"]' },
      { name: '04-scroll-reveal', selector: '#scroll-reveal' },
      { name: '05-sound-music', selector: '#sound' },
      { name: '06-sixteen-reasons', selector: '#reasons' },
      { name: '07-memories-gallery', selector: '#memories' },
      { name: '08-letter', selector: '#letter' },
      { name: '09-vault', selector: '#vault' },
      { name: '10-guestbook', selector: '#guestbook' },
      { name: '11-review', selector: '#review, [id*="review"]' },
      { name: '12-footer', selector: 'footer' }
    ];

    for (const sec of sections) {
      const el = await page.$(sec.selector);
      if (el) {
        try {
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          await el.screenshot({ path: path.join(outDir, `${sec.name}-${width}px.png`) });
        } catch (e) {
          console.warn(`Could not screenshot ${sec.name} at ${width}px:`, e.message);
        }
      } else {
        console.warn(`Selector not found: ${sec.selector} for ${sec.name}`);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log(`All ${targetDir} screenshots saved to ${outDir}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
