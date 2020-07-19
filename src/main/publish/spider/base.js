const { BrowserWindow, app } = require('electron');
const pie = require('puppeteer-in-electron');
const puppeteer = require('puppeteer-core');
const fs = require('fs-extra');
const path = require('path');
const url = require('url');
//
class Base {
  constructor(title, markdown, images, platform) {
    this.title = title;
    this.markdown = markdown;
    this.images = images;
    this.platform = platform;
  }

  async publish() {
    this.operation = 'publish';
    await this.run();
  }

  destroy() {
    this.window.destroy();
  }

  throwError(name, message, stack) {
    const err = new Error();
    err.name = name;
    err.message = message;
    err.stack = stack || err.stack;
    throw err;
  }

  async getElement(sel) {
    try {
      const ele = await this.page.waitForSelector(sel, { timeout: 10000 });
      return ele;
    } catch (err) {
      this.throwError(`INVALID_ELEMENT`, err.message, err.stack);
      return null;
    }
  }

  async click(sel) {
    const ele = await this.getElement(sel);
    await ele.click();
    await this.wait();
  }

  async getElementProperty(sel, key) {
    const value = await this.page.$eval(sel, (e, property) => e[property], key);
    return value;
  }

  log(message) {
    console.log(`spider: ${message}`);
  }

  async wait(duration = 5000) {
    await this.page.waitFor(duration);
  }

  async run() {
    try {
      await this.checkParams();
      //
      await this.initWindow();
      //
      await this.goToEditor();
      //
      await this.checkCookie();
      //
      await this.beforeEdit();
      //
      await this.edit();
      //
      await this.afterEdit();
      //
      await this.beforeSubmit();
      //
      await this.submit();
      //
      await this.afterSubmit();
    } finally {
      if (this.contentFile) {
        await fs.remove(this.contentFile);
      }
      // this.destroy();
    }
  }

  async afterSubmit() {
    this.log('after submit');
  }

  async submit() {
    this.log('sumit');
    const sels = this.platform.el[this.operation];
    for (const sel of sels) {
      await this.click(sel);
    }
  }

  async beforeSubmit() {
    this.log('before publish');
    await this.wait();
  }

  async afterEdit() {
    this.log('after edit');
    await this.wait();
  }

  async edit() {
    this.log('edit');
    await this.getElement(this.platform.el.title);
    await this.page.evaluate(this.inputTitle, this.title, this.platform);
    await this.uploadImages();
    await this.convertContent();
    if (this.platform.contentType === 'import') {
      await this.getElement(this.platform.el.content);
      await this.importContent();
    } else {
      await this.page.evaluate(this.inputContent, this.markdown, this.platform);
    }
  }

  async inputContent(markdown, platform) {
    const el = document.querySelector(platform.el.content);
    el.focus();
    try {
      el.select();
    } catch (err) {
      //
    }
    document.execCommand('delete', false);
    document.execCommand('insertText', false, markdown);
  }

  async importContent() {
    await this.saveContent2File();
    //
    for (const sel of this.platform.el.importButton) {
      await this.click(sel);
    }
    //
    const importInput = await this.getElement(this.platform.el.importInput);
    await importInput.uploadFile(this.contentFile);
    //
  }

  async saveContent2File() {
    const contentFile = path.join(app.getPath('appData'), app.name, `${Date.now().toString()}.md`);
    await fs.writeFile(contentFile, this.markdown);
    this.contentFile = contentFile;
  }

  async convertContent() {
    this.log('convert content');
  }

  async uploadImages() {
    if (this.images.length === 0) {
      return;
    }
    for (const image of this.images) {
      for (const sel of this.platform.el.imageButton) {
        await this.click(sel);
      }
      const imageInput = await this.getElement(this.platform.el.imageInput);
      await imageInput.uploadFile(image.filePath);
      await this.wait();
      let imageUrl = await this.getImageUrl();
      const { protocol, host, pathname } = url.parse(imageUrl);
      imageUrl = `${protocol}//${host}${pathname}`;
      this.markdown = this.markdown.replace(image.src, imageUrl);
    }
  }

  async getImageUrl() {
    //
  }

  async inputTitle(title, platform) {
    const el = document.querySelector(platform.el.title);
    el.focus();
    el.select();
    document.execCommand('delete', false);
    document.execCommand('insertText', false, title);
  }

  async beforeEdit() {
    this.log('before edit');
  }

  async checkCookie() {
    this.log('check cookie');
    const cookies = await this.page.cookies();
    const exists = cookies.some(({ name, value, domain }) => value
    && name === this.platform.cookies.name
    && domain === this.platform.cookies.domain);
    if (!exists) {
      this.throwError('COOKIE_ERROR', 'not login');
    }
  }

  async goToEditor() {
    this.log('go to editor');
    await this.window.loadURL(this.platform.url.editor);
  }

  async initWindow() {
    this.log('init window');
    this.browser = await pie.connect(app, puppeteer);
    this.window = new BrowserWindow({
      show: true,
      webPreferences: { nodeIntegration: false },
      width: 1080,
      height: 720,
    });
    this.page = await pie.getPage(this.browser, this.window);
  }

  async checkParams() {
    this.log('check params');
    let message = null;
    if (!this.title) {
      message = `no title`;
    } else if (!this.markdown) {
      message = `no markdown`;
    } else if (!this.images) {
      message = `no images`;
    } else if (!this.platform) {
      message = `no platform`;
    }
    if (message) {
      this.throwError(`INVALID_PARAMA`, message);
    }
  }
}

module.exports = Base;
