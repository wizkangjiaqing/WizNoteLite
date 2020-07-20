const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { getCurrentLang } = require('../../i18n');
const { platformWindows } = require('./window_helper');

//
async function openPlatformWindow(event, userGuid, kbGuid, noteGuid) {
  const openedWindow = platformWindows.get(noteGuid);
  if (openedWindow) {
    openedWindow.show();
    return;
  }
  //
  const window = new BrowserWindow({
    show: true,
    width: 1200,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, '..', '..', '..', 'web', 'preload.js'),
    },
  });
  //
  const publishUrl = process.env.ELECTRON_START_URL
  || url.format({
    pathname: path.join(__dirname, '..', '..', '..', '..', 'web-app', 'index.html'),
    protocol: 'file:',
    slashes: true,
  });

  const lang = getCurrentLang();
  window.loadURL(`${publishUrl}?lang=${lang}&page=publish&noteGuid=${noteGuid}`);
  //
  window.on('close', () => {
    platformWindows.delete(noteGuid);
  });
  platformWindows.set(noteGuid, window);
}

module.exports = openPlatformWindow;
