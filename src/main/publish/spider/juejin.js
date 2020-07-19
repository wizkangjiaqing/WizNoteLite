const Base = require('./base');

class Juejin extends Base {
  async checkParams() {
    await super.checkParams();
    if (this.images.length > 0) {
      this.throwError(`INVALID_PARAM`, 'juejin can not upload image');
    }
  }

  
}

module.exports = Juejin;
