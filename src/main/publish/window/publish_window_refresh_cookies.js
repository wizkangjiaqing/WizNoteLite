const { BrowserWindow, app } = require('electron');
const pie = require('puppeteer-in-electron');
const puppeteer = require('puppeteer-core');
const { publishPlatform: { getPlatforms }, publishCookie: { setPlatformCookie } } = require('../data');

/**
 * loadURL has performance issue sometimes
 */
async function openRefreshCookieWindow() {
  const browser = await pie.connect(app, puppeteer);
  const window = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: false },
  });
  //
  const platforms = await getPlatforms();
  for (const platform of platforms) {
    await window.loadURL(platform.url.check);
    const page = await pie.getPage(browser, window);
    const cookies = await page.cookies();
    const exists = cookies.some(({ name, value, domain }) => value
      && name === platform.cookies.name
      && domain === platform.cookies.domain);
    await setPlatformCookie(platform.id, exists);
  }
  window.destroy();
}

module.exports = openRefreshCookieWindow;
