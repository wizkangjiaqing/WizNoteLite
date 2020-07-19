const Base = require('./base');
//
class Zhihu extends Base {
  async getImageUrl() {
    const imageUrl = await this.page.$eval('.Image--isBlock', (e) => e.src);
    await this.click(this.platform.el.content);
    await this.page.keyboard.press('Backspace');
    await this.wait();
    await this.page.keyboard.press('Backspace');
    await this.wait();
    return imageUrl;
  }
}

module.exports = Zhihu;
