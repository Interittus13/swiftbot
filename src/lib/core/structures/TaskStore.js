const Task = require('./Task');
const Store = require('./base/Store');

class TaskStore extends Store {
  constructor(client) {
    super(client, 'tasks', Task);
  }
}

module.exports = TaskStore;
