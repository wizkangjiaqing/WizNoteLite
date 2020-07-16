const { BrowserWindow, app } = require('electron');
const pie = require('puppeteer-in-electron');
const puppeteer = require('puppeteer-core');
//
class Base {
  constructor(title, markdown, images, platform, options) {
    this.title = title;
    this.markdown = markdown;
    this.images = images;
    this.platform = platform;
    this.options = options;
  }

  destroy() {
    this.window.destroy();
  }

  async run() {
    await this.init();
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
    await this.beforePublish();
    //
    await this.publish();
    //
    await this.afterPublish();
  }

  async afterPublish() {
    this.window.destroy();
  }

  async publish() {
    let el;
    if (this.options.draft) {
      el = await this.page.$(this.platform.el.draft);
      if (!el) {
        throw new Error(`draft button (selector: ${this.platform.el.draft}) cannot be found`);
      }
    } else {
      el = await this.page.$(this.platform.el.publish);
      if (!el) {
        throw new Error(`publish button (selector: ${this.platform.el.publish}) cannot be found`);
      }
    }
    await el.click();
  }

  async beforePublish() {
    console.log('before publish');
  }

  async afterEdit() {
    console.log('after edit');
  }

  async edit() {
    await this.inputTitle();
    await this.uploadImages();
    await this.convertContent();
    await this.inputContent();
  }

  async inputContent() {
    if (this.platform.inputContentType === 'import') {
      await this.importContent();
    } else {
      await this.insertContent();
    }
  }

  async insertContent() {
    const elContent = await this.page.$(this.platform.el.content);
    if (!elContent) {
      throw new Error(`content (selector: ${this.platform.el.content}) cannot be found`);
    }
    await this.page.evaluate(async (sel, content) => {
      const el = document.querySelector(sel);
      el.focus();
      el.select();
      document.execCommand('delete', false);
      document.execCommand('insertText', content);
    }, this.platform.el.content, this.markdown);
  }

  async importContent() {
    // save markdown to file
    const file = '';
    const importButton = await this.page.$(this.platform.el.importButton);
    const importInput = await this.page.$(this.platform.el.importInput);
    if (!importButton) {
      throw new Error(`import button (selector: ${this.platform.el.importButton}) cannot be found`);
    }
    if (!importInput) {
      throw new Error(`import input (selector: ${this.platform.el.importInput}) cannot be found`);
    }
    await importButton.click();
    await importInput.uploadFile(file);
  }

  async convertContent() {
    console.log('convertContent');
  }

  async uploadImages() {
    if (this.images.length === 0) {
      return;
    }
    const imageButton = await this.page.$(this.platform.el.imageButton);
    const imageInput = await this.page.$(this.platform.el.imageInput);
    if (!imageButton) {
      throw new Error(`image input (selector: ${this.platform.el.imageButton}) cannot be found`);
    }
    if (!imageInput) {
      throw new Error(`image input (selector: ${this.platform.el.imageInput}) cannot be found`);
    }
    for (const image of this.images) {
      await imageButton.click();
      await imageInput.uploadFile(image);
    }
  }

  async inputTitle() {
    const elTitle = await this.page.$(this.platform.el.title);
    if (!elTitle) {
      throw new Error(`title (selector: ${this.platform.el.title}) cannot be found`);
    }
    await this.page.evaluate(async (sel, title) => {
      const el = document.querySelector(sel);
      el.focus();
      el.select();
      document.execCommand('delete', false);
      document.execCommand('insertText', false, title);
    }, this.platform.el.title, this.title);
  }

  async beforeEdit() {
    console.log('before edit');
  }

  async checkCookie() {
    const cookies = await this.page.cookies();
    const exists = cookies.some(({ name, value, domain }) => value
    && name === this.platform.cookies.name
    && domain === this.platform.cookies.domain);
    // 通知 保存状态
    if (!exists) {
      this.destroy();
      throw new Error(`cookie error`);
    }
  }

  async goToEditor() {
    await this.window.loadURL(this.platform.url.editor);
  }

  async init() {
    await this.checkParams();
    //
    await this.initWindow();
  }

  async initWindow() {
    this.browser = await pie.connect(app, puppeteer);
    this.window = new BrowserWindow({
      show: false,
      webPreferences: { nodeIntegration: false },
    });
    this.page = await pie.getPage(this.browser, this.window);
  }

  async checkParams() {
    if (!this.title) {
      throw new Error(`no title`);
    }
    if (!this.markdown) {
      throw new Error(`no markdown`);
    }
    if (!this.images) {
      throw new Error(`no images`);
    }
    if (!this.platform) {
      throw new Error(`no platform`);
    }
  }
}

module.exports = Base;
