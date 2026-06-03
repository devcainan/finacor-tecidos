import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pageUrl = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const outDir = path.join(__dirname, 'review-screenshots');
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 390,  height: 844 },
];

const sections = [
  { name: 'hero',      selector: '#hero' },
  { name: 'nav',       selector: '.site-header' },
  { name: 'lojas',     selector: '#lojas' },
  { name: 'contato',   selector: '#contato' },
  { name: 'footer',    selector: '.site-footer' },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto(pageUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Full page
  await page.screenshot({ path: path.join(outDir, `${vp.name}-full.png`), fullPage: true });

  // Per section
  for (const sec of sections) {
    try {
      const el = page.locator(sec.selector).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await el.screenshot({ path: path.join(outDir, `${vp.name}-${sec.name}.png`) });
    } catch {}
  }

  await context.close();
}

await browser.close();
console.log('Screenshots saved to:', outDir);
