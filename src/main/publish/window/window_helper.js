// eslint-disable-next-line no-unused-vars
const { BrowserWindow } = require('electron');
//
const EventEmitter = require('events');
//
class Window extends EventEmitter {
  constructor() {
    super();
    this.windows = new Map();
  }

  /**
   * @param {String} noteGuid noteGuid
   * @param {BrowserWindow} window window
   */
  set(noteGuid, window) {
    this.windows.set(noteGuid, window);
  }

  /**
   * @param {String} noteGuid noteGuid
   * @returns {BrowserWindow} window
   */
  get(noteGuid) {
    return this.windows.get(noteGuid);
  }

  delete(noteGuid) {
    this.windows.delete(noteGuid);
  }

  sendMessageToAll(channel, ...args) {
    const noteGuids = this.windows.keys();
    noteGuids.forEach((noteGuid) => {
      this.sendMessageToSpecific(noteGuid, channel, ...args);
    });
  }

  sendMessageToSpecific(noteGuid, channel, ...args) {
    const window = this.get(noteGuid);
    if (window == null) {
      return;
    }
    window.webContents.send(channel, ...args);
  }
}
//
class PlatformWindow extends Window {
  onPlatformChange() {
    this.sendMessageToAll('publishPlatformChange');
  }
}
//
const platformWindows = new PlatformWindow();
//
module.exports = {
  platformWindows,
};
