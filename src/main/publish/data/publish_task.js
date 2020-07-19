const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { getPublishNoteTasksFile } = require('../../common/paths');

async function deleteNoteTask(userGuid, kbGuid, noteGuid) {
  const taskFile = getPublishNoteTasksFile(userGuid, kbGuid, noteGuid);
  await fs.remove(taskFile);
}

async function save2file(userGuid, kbGuid, noteGuid, tasks) {
  if (tasks == null || tasks.length === 0) {
    await deleteNoteTask(userGuid, kbGuid, noteGuid);
    return;
  }
  const taskFile = getPublishNoteTasksFile(userGuid, kbGuid, noteGuid);
  await fs.writeJSON(taskFile, tasks);
}

async function getTasks(userGuid, kbGuid, noteGuid) {
  let tasks = [];
  //
  const taskFile = getPublishNoteTasksFile(userGuid, kbGuid, noteGuid);
  const exists = await fs.exists(taskFile);
  if (exists) {
    tasks = await fs.readJSON(taskFile);
  }
  //
  return tasks;
}

async function addTask(userGuid, kbGuid, noteGuid, platformId, status, message, preview) {
  const guid = uuidv4();
  const created = Date.now();
  const modified = Date.now();
  const task = {
    guid, userGuid, kbGuid, noteGuid, status, message, platformId, created, modified, preview,
  };
  //
  const tasks = await getTasks(userGuid, kbGuid, noteGuid);
  const taskExists = tasks.find((item) => item.platformId === platformId);
  if (taskExists) {
    return;
  }
  tasks.push(task);
  //
  await save2file(userGuid, kbGuid, noteGuid, tasks);
}

async function deleteTask(userGuid, kbGuid, noteGuid, taskGuid) {
  //
  const tasks = await getTasks(userGuid, kbGuid, noteGuid);
  if (tasks.length === 0) {
    return;
  }
  //
  const remainingTasks = tasks.map(({ guid }) => guid !== taskGuid);
  //
  await save2file(userGuid, kbGuid, noteGuid, remainingTasks);
}

async function updateTask(userGuid, kbGuid, noteGuid, taskGuid, status, message, preview) {
  const tasks = await getTasks(userGuid, kbGuid, noteGuid);
  for (const task of tasks) {
    if (task.guid === taskGuid) {
      task.status = status;
      task.message = message;
      task.preview = preview;
      task.modified = Date.now();
    }
  }
  await save2file(userGuid, kbGuid, noteGuid, tasks);
}

async function getTask(userGuid, kbGuid, noteGuid, platformId) {
  const tasks = await getTasks(userGuid, kbGuid, noteGuid);
  const task = tasks.find((value) => (noteGuid === value.noteGuid
    && platformId === value.platformId));
  return task;
}

module.exports = {
  getTasks,
  addTask,
  deleteTask,
  deleteNoteTask,
  updateTask,
  getTask,
};
