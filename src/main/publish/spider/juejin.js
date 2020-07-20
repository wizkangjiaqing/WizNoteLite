const Base = require('./base');

class Juejin extends Base {
  async checkParams() {
    await super.checkParams();
    if (this.draft()) {
      return;
    }
    if (this.images.length > 0) {
      this.throwError(`publishInvalidParams`, 'juejin can not upload image');
    }
  }

  async inputTags() {
    if (this.options.tags.length !== 1) {
      this.throwError(`publishInvalidParams`, `tags error, must have 1 tag`);
    }
    //
    const tag = this.options.tags[0];
    await this.click('.publish-popup');
    const inputEle = await this.getElement('.tag-input > input');
    await inputEle.type(tag);
    await this.wait();
    await this.click('.suggested-tag-list > .tag:nth-child(1)');
    await this.click('.publish-popup');
  }
}

module.exports = Juejin;
