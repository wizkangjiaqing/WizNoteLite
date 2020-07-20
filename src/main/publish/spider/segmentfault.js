const Base = require('./base');

class Segmentfault extends Base {
  async confirmUploadImage() {
    await this.click('.te-alt-text-input');
    await this.pressKey('Tab');
    await this.pressKey('Enter');
  }

  async getImageUrl() {
    const content = await this.getElementProperty(this.platform.el.content, 'innerText');
    const start = content.indexOf('(');
    const end = content.indexOf(')');
    const imageUrl = content.slice(start + 1, end);
    await this.evaluate(this.inputContent, '', this.platform);
    return imageUrl;
  }

  async inputContent(markdown, platform) {
    document.querySelector(platform.el.content).CodeMirror.setValue(markdown);
  }

  async inputTags() {
    if (this.options.tags.length === 0) {
      this.throwError(`publishInvalidParams`, `no tags`);
    }
    //
    await this.click('#add-tag-btn');
    const inputEle = await this.getElement('#searchTag');
    for (const tag of this.options.tags) {
      await this.evaluate(async () => {
        const el = document.querySelector('#searchTag');
        el.select();
        document.execCommand('delete', false);
      });
      //
      await inputEle.type(tag);
      await this.wait();
      await this.evaluate(async () => {
        const el = document.querySelector('#tagSearchResult > a:nth-child(1)');
        if (el) el.click();
      });
      await this.wait();
    }
  }
}

module.exports = Segmentfault;
