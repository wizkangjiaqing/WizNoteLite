const Base = require('./base');

class Csdn extends Base {
  async confirmUploadImage() {
    await this.wait();
    await this.evaluate(async () => {
      const eles = document.querySelectorAll('.btn-c-blue');
      for (const ele of eles) {
        if (ele.textContent === '确定') {
          ele.click();
        }
      }
    });
    await this.wait();
  }

  async getImageUrl() {
    const imageUrl = await this.page.$eval('.img-wrapper', (e) => e.firstElementChild.src);
    await this.evaluate(async () => {
      document.querySelector('.editor__inner').innerHTML = '';
    });
    await this.wait();
    return this.parseImageUrl(imageUrl);
  }

  async inputTags() {
    await this.click('.btn-publish');
    // 形式
    await this.evaluate(async () => document.querySelector('#private').click());
    await this.wait();
    // await this.click('#private');
    // 标签
    // 类型
    await this.evaluate(async () => {
      document.querySelector('select').value = 'original';
    });
    await this.wait();
  }
}

module.exports = Csdn;
