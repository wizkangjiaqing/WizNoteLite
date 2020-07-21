const assert = require('assert');
const URL = require('url');
const WizRequest = require('../common/request');
const versionUtils = require('../../share/version');
const { WizServerError } = require('../../share/error');

class AccountServer {
  // login
  async signUp(server, userId, password, options) {
    //
    if (!options.noCheckExists) {
      assert(!this._user, 'User has already logged in');
    }
    await this.checkServerVersion(server);
    //
    const user = await WizRequest.standardRequest(Object.assign({
      method: 'post',
      url: `${server}/as/user/signup`,
      data: {
        userId,
        password,
        noGuideNote: true,
      },
    }, options));
    if (this._user) {
      Object.assign(this._user, user);
    } else {
      this._user = user;
    }
    this._server = server;
    this._password = password;
    return user;
  }

  get isOfficial() {
    const url = URL.parse(this._server);
    if (url.hostname === 'as.wiz.cn') {
      return true;
    }
    return false;
  }

  getLink(name) {
    if (this.isOfficial) {
      return `https://api.wiz.cn/?p=wiz&c=link&n=${name}`;
    }
    return `${this._server}/?p=wiz&c=link&n=${name}`;
  }

  // login
  async login(server, userId, password, options) {
    //
    if (!options.noCheckExists) {
      assert(!this._user, 'User has already logged in');
    }
    await this.checkServerVersion(server);
    //
    const user = await WizRequest.standardRequest(Object.assign({
      method: 'post',
      url: `${server}/as/user/login`,
      data: {
        userId,
        password,
      },
    }, options));
    if (this._user) {
      Object.assign(this._user, user);
    } else {
      this._user = user;
    }
    this._server = server;
    this._password = password;
    return user;
  }

  //
  get currentUser() {
    assert(this._user, 'User has not logged in');
    return this._user;
  }

  //
  setCurrentUser(user, password, server) {
    assert(!this._user, 'User has already logged in');
    this._user = user;
    this._server = server;
    this._password = password;
  }

  //
  async checkServerVersion(server) {
    const url = URL.parse(server);
    if (url.hostname === 'as.wiz.cn') {
      return;
    }
    try {
      const options = {
        url: `${server}/manage/server/version`,
      };
      const version = await WizRequest.standardRequest(options);
      if (versionUtils.compareVersion(version, '1.0.24') < 0) {
        throw new WizServerError('Server update needed', 'WizErrorUpdateServer');
      }
    } catch (err) {
      throw new WizServerError(err.message, 'WizErrorUnknownServerVersion');
    }
  }
}

module.exports = AccountServer;
