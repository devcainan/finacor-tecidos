const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.waitForTimeout(500);

  // Header transparente (topo)
  await page.screenshot({ path: 'check-logo-topo.png' });

  // Header scrolled (fundo branco)
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'check-logo-scrolled.png' });

  // Footer — captura apenas o elemento footer
  const footer = await page.$('footer.site-footer');
  await footer.screenshot({ path: 'check-logo-footer.png' });

  await browser.close();
  console.log('Screenshots salvas.');
})();
