/* eslint-disable no-param-reassign */
const { BrowserWindow, app } = require('electron');
const pie = require('puppeteer-in-electron');
const puppeteer = require('puppeteer-core');
const fs = require('fs-extra');
const path = require('path');
const url = require('url');
//
class Base {
  VALID_OPERATIONS = ['publish', 'draft'];

  constructor(title, markdown, images, platform, options = {}) {
    this.title = title;
    this.markdown = markdown;
    this.images = images;
    this.platform = platform;
    if (!options.tags) options.tags = [];
    if (!options.operation) options.operation = 'publish';
    if (!this.VALID_OPERATIONS.includes(options.operation)) {
      this.throwError(`publishInvalidParams`, `invalid operation: ${options.operation}`);
    }
    this.options = options;
  }

  draft() {
    return this.options.operation === 'draft';
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

  async evaluate(pageFunction, ...args) {
    const result = await this.page.evaluate(pageFunction, ...args);
    await this.wait();
    return result;
  }

  async getElement(sel) {
    try {
      const ele = await this.page.waitForSelector(sel, { timeout: 10000 });
      return ele;
    } catch (err) {
      this.throwError(`publishInvalidElement`, err.message, err.stack);
      return null;
    }
  }

  async click(sel) {
    await this.getElement(sel);
    await this.page.click(sel);
    await this.wait();
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
    await this.wait();
  }

  async getElementProperty(sel, key) {
    await this.getElement(sel);
    const value = await this.page.$eval(sel, (e, property) => e[property], key);
    return value;
  }

  log(message) {
    console.log(`spider: ${message}`);
  }

  async wait(duration = 5000) {
    await this.page.waitFor(duration);
  }

  async execute() {
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
      //
      return this.preview;
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
    const sels = this.platform.el[this.options.operation];
    if (!sels) {
      await this.wait();
      return;
    }
    for (const sel of sels) {
      await this.click(sel);
    }
  }

  async beforeSubmit() {
    if (this.draft()) {
      return;
    }
    await this.wait();
    await this.inputTags();
  }

  async inputTags() {
    //
  }

  async afterEdit() {
    await this.wait();
  }

  async edit() {
    await this.getElement(this.platform.el.title);
    await this.evaluate(this.inputTitle, this.title, this.platform);
    //
    await this.uploadImages();
    //
    await this.convertContent();
    //
    await this.getElement(this.platform.el.content);
    if (this.platform.contentType === 'import') {
      await this.importContent();
    } else {
      await this.evaluate(this.inputContent, this.markdown, this.platform);
    }
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
    await this.wait();
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
    for (const image of this.images) {
      for (const sel of this.platform.el.imageButton) {
        await this.click(sel);
      }
      //
      const imageInput = await this.getElement(this.platform.el.imageInput);
      await imageInput.uploadFile(image.filePath);
      //
      await this.wait();
      //
      await this.confirmUploadImage();
      //
      await this.wait();
      //
      const imageUrl = await this.getImageUrl();
      this.markdown = this.markdown.replace(image.src, imageUrl);
    }
  }

  async parseImageUrl(imageUrl) {
    const { protocol, host, pathname } = url.parse(imageUrl);
    const parsedUrl = `${protocol}//${host}${pathname}`;
    return parsedUrl;
  }

  async getImageUrl() {
    //
  }

  async confirmUploadImage() {
    //
  }

  async beforeEdit() {
    //
  }

  async checkCookie() {
    const cookies = await this.page.cookies();
    const exists = cookies.some(({ name, value, domain }) => value
    && name === this.platform.cookies.name
    && domain === this.platform.cookies.domain);
    if (!exists) {
      this.throwError('publishCookieError', 'not login');
    }
  }

  async goToEditor() {
    await this.window.loadURL(this.platform.url.editor);
  }

  async initWindow() {
    this.log('init window');
    this.browser = await pie.connect(app, puppeteer);
    this.window = new BrowserWindow({
      show: true,
      webPreferences: { nodeIntegration: false },
      width: 1200,
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
      this.throwError(`publishInvalidParams`, message);
    }
  }

  /**
   * function execute in browser context
   */
  async inputTitle(title, platform) {
    const el = document.querySelector(platform.el.title);
    el.focus();
    try {
      el.select();
    } catch (err) {
      console.error(err);
    }
    document.execCommand('delete', false);
    document.execCommand('insertText', false, title);
  }

  /**
   * function execute in browser context
   */
  async inputContent(markdown, platform) {
    const el = document.querySelector(platform.el.content);
    el.focus();
    try {
      el.select();
    } catch (err) {
      console.error(err);
    }
    document.execCommand('delete', false);
    document.execCommand('insertText', false, markdown);
  }
}

module.exports = Base;
