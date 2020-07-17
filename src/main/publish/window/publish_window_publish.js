const users = require('../../user/users');
const { publishPlatform: { getPlatforms } } = require('../data');
const { platformWindows } = require('./window_helper');
//
async function openPublishWindow(event, userGuid, kbGuid, noteGuid, platformIds) {
  const note = await users.getNote(userGuid, kbGuid, noteGuid);
  const markdown = await users.getNoteMarkdown(userGuid, kbGuid, noteGuid);
  //
  const platforms = (await getPlatforms()).map(({ id }) => platformIds.include(id));
  for (const platform of platforms) {
    platformWindows.onPlatformChange();
  }
}

module.exports = openPublishWindow;
