const Store = require('electron-store');

const store = new Store();


function setSettings(key, value) {
  store.set(key, value);
}

function getSettings(key, defaultValue) {
  const value = store.get(key);
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

function deleteSettings(key) {
  store.delete(key);
}

function setLastAccount(userGuid) {
  store.set('lastAccount', userGuid);
}

function getLastAccount() {
  return store.get('lastAccount');
}

module.exports = {
  setSettings,
  getSettings,
  deleteSettings,
  setLastAccount,
  getLastAccount,
};
