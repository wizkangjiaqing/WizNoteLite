const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { getCurrentLang } = require('../../i18n');
//
const WindowMap = new Map();
//
async function openHomeWindow(event, userGuid, kbGuid, noteGuid) {
  const openedWindow = WindowMap.get(noteGuid);
  if (openedWindow) {
    openedWindow.show();
    return;
  }
  //
  const window = new BrowserWindow({
    show: true,
    webPreferences: {
      nodeIntegration: true,
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
    WindowMap.delete(noteGuid);
  });
}

module.exports = openHomeWindow;
