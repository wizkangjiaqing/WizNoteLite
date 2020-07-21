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
    let result = null;
    if (this.draft()) {
      await this.page.goto('https://zhuanlan.zhihu.com/drafts');
      result = await this.evaluate(async () => {
        try {
          const item = document.querySelector('.ColumnDrafts-drafts').firstElementChild.firstElementChild;
          const preview = item.href;
          const title = item.innerText;
          return { preview, title };
        } catch (error) {
          return { error };
        }
      });
    } else {
      //
      await this.wait();
      result = await this.evaluate(async () => {
        try {
          const preview = window.location.href;
          const title = document.querySelector('.Post-Title').innerText;
          return { preview, title };
        } catch (error) {
          console.error(error);
          return { error };
        }
      });
    }
    if (result.error) {
      console.error(result.error);
      this.throwError(`publishUnknownError`, result.error.message, result.error.stack);
    }
    //
    if (this.title !== result.title) {
      this.throwError(`publishUnknownError`, `result check error`);
    }
    //
    this.preview = result.preview;
  }
}

module.exports = Zhihu;
