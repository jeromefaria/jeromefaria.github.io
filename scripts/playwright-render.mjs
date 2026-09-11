import { chromium } from '@playwright/test';

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

export const withBrowser = async run => {
  const browser = await chromium.launch();
  try {
    return await run(browser);
  } finally {
    await browser.close();
  }
};

export const renderCard = async (browser, { html, path, type = 'png', quality }) => {
  const page = await browser.newPage({ viewport: { width: CARD_WIDTH, height: CARD_HEIGHT }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({
    path,
    clip: { x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT },
    ...(type === 'jpeg' ? { type, quality } : {}),
  });
  await page.close();
};

export const renderPdf = async (browser, { html, path, margin }) => {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.pdf({ path, format: 'A4', printBackground: true, margin });
  await page.close();
};
