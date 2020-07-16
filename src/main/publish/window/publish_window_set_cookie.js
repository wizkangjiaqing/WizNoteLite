const { BrowserWindow, app } = require('electron');
const pie = require('puppeteer-in-electron');
const puppeteer = require('puppeteer-core');
const { publishPlatform: { getPlatforms }, publishCookie: { setPlatformCookie } } = require('../data');

async function openSetCookieWindow(event, platformId) {
  const platforms = await getPlatforms();
  const platform = platforms.find((value) => (value.id === platformId ? value : undefined));
  //
  const browser = await pie.connect(app, puppeteer);
  const window = new BrowserWindow({
    show: true,
    webPreferences: { nodeIntegration: false },
  });
  await window.loadURL(platform.url.login);
  const page = await pie.getPage(browser, window);
  //
  window.on('close', async () => {
    const cookies = await page.cookies();
    const exists = cookies.some(({ name, value, domain }) => name === platform.cookies.name
      && domain === platform.cookies.domain
      && value);
    await setPlatformCookie(platformId, exists);
  });
}

module.exports = openSetCookieWindow;
