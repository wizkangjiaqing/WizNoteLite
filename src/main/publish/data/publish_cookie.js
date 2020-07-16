const { setSettings, getSettings, deleteSettings } = require('../../settings/global_settings');

function getSettingsKey(platformId) {
  return `publish_cookie_${platformId}`;
}

function setPlatformCookie(platformId, exists) {
  setSettings(getSettingsKey(platformId), exists);
}

function deletePlatformCookie(platformId) {
  deleteSettings(getSettingsKey(platformId));
}

function getPlatformCookie(platformId) {
  return getSettings(getSettingsKey(platformId), 0);
}

module.exports = {
  setPlatformCookie,
  deletePlatformCookie,
  getPlatformCookie,
};
