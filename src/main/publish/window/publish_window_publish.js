const fs = require('fs-extra');
const path = require('path');
const users = require('../../user/users');
const { publishPlatform: { getPlatforms }, publishTask: { addTask, getTask, updateTask } } = require('../data');
const { platformWindows } = require('./window_helper');
const spiders = require('../spider');
const { getNoteResources } = require('../../common/paths');
//
const imageExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];
async function getNoteImages(userGuid, kbGuid, noteGuid, markdown) {
  const indexFilesDir = getNoteResources(userGuid, kbGuid, noteGuid);
  const files = await fs.readdir(indexFilesDir);
  const images = files
    .filter((file) => imageExtensions.includes(path.extname(file)))
    .filter((file) => markdown.includes(file))
    .map((file) => ({ src: `index_files/${file}`, filePath: path.join(indexFilesDir, file) }));
  return images;
}
//
async function openPublishWindow(event, userGuid, kbGuid, noteGuid, platformIds) {
  const note = await users.getNote(userGuid, kbGuid, noteGuid);
  const markdown = await users.getNoteMarkdown(userGuid, kbGuid, noteGuid);
  const images = await getNoteImages(userGuid, kbGuid, noteGuid, markdown);
  //
  const platforms = (await getPlatforms()).filter(({ id }) => platformIds.includes(id));
  //
  for (const platform of platforms) {
    let status = 0;
    let message = '未发布';
    const preview = null;
    try {
      const spider = new spiders[platform.id](note.title, markdown, images, platform);
      await spider.publish();
      status = 1;
      message = '成功';
    } catch (err) {
      console.error(err);
      status = -1;
      message = '错误';
    } finally {
      const task = await getTask(userGuid, kbGuid, noteGuid, platform.id);
      if (task) {
        await updateTask(userGuid, kbGuid, noteGuid, task.guid, status, message, preview);
      } else {
        await addTask(userGuid, kbGuid, noteGuid, platform.id, status, message, preview);
      }
    }
    platformWindows.onPlatformChange();
  }
}

module.exports = openPublishWindow;
