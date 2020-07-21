const { app } = require('electron');
const path = require('path');
const fs = require('fs-extra');

function getAppData() {
  return path.join(app.getPath('appData'), app.name);
}

function getUsersData() {
  const p = path.join(getAppData(), 'users');
  fs.ensureDirSync(p);
  return p;
}

function getUserData(userGuid) {
  const p = path.join(getUsersData(), userGuid);
  fs.ensureDirSync(p);
  return p;
}

function getNoteData(userGuid, kbGuid, noteGuid) {
  const p = path.join(getUserData(userGuid), kbGuid, noteGuid);
  fs.ensureDirSync(p);
  return p;
}

function getNoteResources(userGuid, kbGuid, noteGuid) {
  const p = path.join(getNoteData(userGuid, kbGuid, noteGuid), 'index_files');
  fs.ensureDirSync(p);
  return p;
}

function getPublish(userGuid) {
  const p = path.join(getUserData(userGuid), 'publish');
  fs.ensureDirSync(p);
  return p;
}

function getPublishNoteTasksFile(userGuid, kbGuid, noteGuid) {
  const p = path.join(getPublish(userGuid), 'tasks');
  fs.ensureDirSync(p);
  return path.join(p, noteGuid);
}

function getPublishTempFile(userGuid, randomName) {
  const p = path.join(getPublish(userGuid), 'temp');
  fs.ensureDirSync(p);
  return path.join(p, randomName);
}

function getTempPath() {
  const base = app.getPath('temp');
  const rand = new Date().valueOf();
  const newTemp = path.join(base, `${rand}`);
  fs.ensureDirSync(newTemp);
  return newTemp;
}

module.exports = {
  getAppData,
  getUsersData,
  getUserData,
  getNoteData,
  getNoteResources,
  getPublish,
  getPublishNoteTasksFile,
  getPublishTempFile,
  getTempPath,
};
