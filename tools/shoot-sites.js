/* =====================================================================
   shoot-sites.js — capture client sites for the IN MOTION rails

   Reads tools/sites.txt (one URL per line) and writes, for each:

       images/sites/NN-desktop.jpg    1440 x 900
       images/sites/NN-mobile.jpg      390 x 844

   NN is the line number, so line 1 becomes 01-*. website.html references
   those numbered files, which means the HTML never has to change when a
   URL is corrected — fix the line in sites.txt and re-run.

   SETUP (once)
       npm init -y
       npm install playwright
       npx playwright install chromium

   RUN
       node tools/shoot-sites.js

   Options
       --only 3,7      capture just those line numbers
       --full          full-page rather than viewport-height capture

   Notes
     - Sites that fail (dead domain, timeout, TLS error) are reported at
       the end and skipped; one bad URL never stops the run.
     - Existing files are overwritten, so re-running refreshes everything.
     - It waits for the network to settle, then a beat longer, so hero
       animations and lazy images have landed before the shutter.
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LIST = path.join(__dirname, 'sites.txt');
const OUT = path.join(ROOT, 'images', 'sites');

const args = process.argv.slice(2);
const fullPage = args.includes('--full');

let only = null;
const onlyIdx = args.indexOf('--only');
if (onlyIdx !== -1 && args[onlyIdx + 1]) {
  only = new Set(args[onlyIdx + 1].split(',').map(n => parseInt(n, 10)));
}

const VIEWS = [
  { name: 'desktop', width: 1440, height: 900, scale: 1, mobile: false },
  { name: 'mobile', width: 390, height: 844, scale: 2, mobile: true }
];

function readList() {
  if (!fs.existsSync(LIST)) {
    console.error('Missing ' + LIST);
    process.exit(1);
  }
  return fs.readFileSync(LIST, 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
    .map(u => (/^https?:\/\//i.test(u) ? u : 'https://' + u));
}

(async () => {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (e) {
    console.error('Playwright is not installed. Run:\n  npm install playwright && npx playwright install chromium');
    process.exit(1);
  }

  const urls = readList();
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const failed = [];
  let shots = 0;

  for (let i = 0; i < urls.length; i++) {
    const n = i + 1;
    if (only && !only.has(n)) continue;

    const url = urls[i];
    const tag = String(n).padStart(2, '0');

    for (const view of VIEWS) {
      const context = await browser.newContext({
        viewport: { width: view.width, height: view.height },
        deviceScaleFactor: view.scale,
        isMobile: view.mobile,
        hasTouch: view.mobile,
        /* some hosts serve a stripped page to unknown agents */
        userAgent: view.mobile
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
          : undefined
      });

      const page = await context.newPage();

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        /* let hero animations and lazy images settle before the shutter */
        await page.waitForTimeout(2500);

        const file = path.join(OUT, tag + '-' + view.name + '.jpg');
        await page.screenshot({ path: file, type: 'jpeg', quality: 82, fullPage });

        shots++;
        console.log('  ok   ' + tag + '-' + view.name + '  ' + url);
      } catch (err) {
        failed.push(tag + '-' + view.name + '  ' + url + '  (' + err.message.split('\n')[0] + ')');
        console.log('  FAIL ' + tag + '-' + view.name + '  ' + url);
      }

      await context.close();
    }
  }

  await browser.close();

  console.log('\n' + shots + ' screenshots written to images/sites/');
  if (failed.length) {
    console.log('\n' + failed.length + ' failed:');
    failed.forEach(f => console.log('  ' + f));
    console.log('\nCheck those URLs in tools/sites.txt and re-run with --only <n>.');
  }
})();
