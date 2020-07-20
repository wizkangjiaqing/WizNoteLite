const { ipcMain } = require('electron');
const {
  openPlatformWindow, openPublishWindow, openSetCookieWindow,
  openRefreshCookieWindow, openPreviewWindow,
} = require('./window');
const {
  publishNote: { getNote },
  publishTask: { getTasks },
  publishPlatform: { getPlatforms },
  publishCookie: { getPlatformCookie },
} = require('./data');
//
async function publishGetWebPlatforms(event, userGuid, kbGuid, noteGuid) {
  const tasks = await getTasks(userGuid, kbGuid, noteGuid);
  const platforms = await getPlatforms();
  //
  const webPlatforms = [];
  for (const {
    icon, id, name, intro, tags,
  } of platforms) {
    const webPlatform = {
      icon, id, name, intro, tags,
    };
    webPlatform.logged = await getPlatformCookie(id);
    let task = tasks.find(({ platformId }) => platformId === id);
    if (!task) {
      task = { status: 0, message: '未发布' };
    }
    const { status, message, preview } = task;
    webPlatform.status = status;
    webPlatform.message = message;
    webPlatform.preview = preview;
    webPlatforms.push(webPlatform);
  }
  return webPlatforms;
}
//
ipcMain.handle('publishGetWebPlatforms', publishGetWebPlatforms);
//
ipcMain.handle('publishRefreshCookies', openRefreshCookieWindow);
//
ipcMain.handle('publishSetCookie', openSetCookieWindow);
//
ipcMain.handle('publishPublishNote', openPublishWindow);
//
ipcMain.handle('publishOpenPlatformWindow', openPlatformWindow);
//
ipcMain.handle('publishPreview', openPreviewWindow);
