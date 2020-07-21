const Base = require('./base');
//
class Jianshu extends Base {
  async beforeEdit() {
    //
    await this.click('.fa-bars');
    await this.page.hover('.fa-keyboard-o');
    await this.wait();
    //
    await this.evaluate(async () => {
      document.querySelectorAll('span').forEach((span) => {
        if (span.textContent.trim() === 'MarkDown编辑器') {
          span.click();
        }
      });
    });
    await this.wait();
    //
    await this.page.evaluate(async () => {
      document.querySelectorAll('span').forEach((span) => {
        if (span.textContent.trim() === '新建文章') {
          span.click();
        }
      });
    });
    await this.wait();
  }

  async getImageUrl() {
    const content = await this.page.$eval(this.platform.el.content, (e) => e.value);
    await this.evaluate(async (platform) => {
      const ele = document.querySelector(platform.el.content);
      ele.focus();
      try {
        ele.select();
      } catch (err) {
        console.error(err);
      }
      document.execCommand('delete', false);
    }, this.platform);
    const start = content.indexOf('https:');
    const end = content.indexOf('?');
    const imageUrl = content.slice(start, end);
    return this.parseImageUrl(imageUrl);
  }

  async afterSubmit() {
    let preview = null;
    if (this.draft()) {
      preview = await this.page.url();
    } else {
      preview = await this.evaluate(async (title) => {
        const eles = document.querySelectorAll('a');
        for (const a of eles) {
          if (a.textContent.trim() === title) {
            return a.href;
          }
        }
        return null;
      }, this.title);
    }
    if (preview) {
      this.preview = preview;
    } else {
      this.throwError(`publishUnknownError`, `result check error`);
    }
  }
}

module.exports = Jianshu;
