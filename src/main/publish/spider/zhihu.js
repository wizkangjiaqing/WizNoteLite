const Base = require('./base');
//
class Zhihu extends Base {
  async getImageUrl() {
    const imageUrl = await this.getElementProperty('.Image--isBlock', 'src');
    await this.click(this.platform.el.content);
    await this.pressKey('Backspace');
    await this.pressKey('Backspace');
    return this.parseImageUrl(imageUrl);
  }

  async afterSubmit() {
    if (this.draft()) {
      await this.page.goto('https://zhuanlan.zhihu.com/drafts');
      const result = await this.evaluate(async () => {
        const item = document.querySelector('.ColumnDrafts-drafts').firstElementChild.firstElementChild;
        const preview = item.href;
        const title = item.innerText;
        return { preview, title };
      });
      //
      if (this.title !== result.title) {
        this.throwError(`publishUnknownError`, `draft check error`);
      }
      //
      this.preview = result.preview;
    } else {
      //
    }
  }
}

module.exports = Zhihu;
