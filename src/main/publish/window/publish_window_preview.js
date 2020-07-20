const { BrowserWindow } = require('electron');
//
async function openPreviewWindow(event, previewUrl) {
  const window = new BrowserWindow({
    show: true,
    webPreferences: { nodeIntegration: false },
  });
  await window.loadURL(previewUrl);
}

module.exports = openPreviewWindow;
