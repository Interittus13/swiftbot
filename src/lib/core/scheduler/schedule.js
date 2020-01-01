const ScheduleTask = require('./scheduleTask');

class Schedule {
  constructor(client) {
    this.client = client;
    this.tasks = [];
    this._interval = null;
  }

  get _tasks() {
    return this.client.settings.schedules;
  }

  async init() {
    const tasks = this._tasks;
    if (!tasks || !Array.isArray(tasks)) return;

    for (const task of tasks) {
      try {
        await this._add(task.taskName, task.repeat || task.time, task);
      } catch (error) {
        this.client.logger.warn(`Task ${task.taskName} [${task.id}] was not queued: ${error}`);
      }
    }
    this._checkInterval();
  }

  async execute() {
    if (!this.client.ready) return;
    if (this.tasks.length) {
      const now = Date.now();
      const execute = [];
      for (const task of this.tasks) {
        if (task.time.getTime() > now) break;
        execute.push(task.run());
      }

      if (!execute.length) return;
      await Promise.all(execute);
    }
    this._checkInterval();
  }

  get(id) {
    return this.tasks.find(task => task.id === id);
  }

  next() {
    return this.tasks[0];
  }

  async create(taskName, time, options) {
    const task = await this._add(taskName, time, options);
    if (!task) return null;
    await this.client.settings.update('schedules', task, { action: 'add' });
    return task;
  }

  async delete(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('This task does not exist.');

    this.tasks.splice(index, 1);
    const task = this._tasks.find(t => t.id === id);
    if (task) await this.client.settings.update('schedules', task, { action: 'remove' });

    return this;
  }

  async clear() {
    await this.client.settings.reset('schedules');
    this.tasks = [];
  }

  async _add(taskName, time, options) {
    const task = new ScheduleTask(this.client, taskName, time, options);

    if (!task.catchUp && task.time < Date.now()) {
      if (!task.recurring) {
        await task.delete();
        return null;
      }
      await task.update({ time: task.recurring });
    }
    this._insert(task);
    this._checkInterval();
    return task;
  }

  _insert(task) {
    const index = this.tasks.findIndex(entry => entry.time > task.time);
    if (index === -1) this.tasks.push(task);
    else this.tasks.splice(index, 0, task);
    return task;
  }

  _clearInterval() {
    this.client.clearInterval(this._interval);
    this._interval = null;
  }

  _checkInterval() {
    if (!this.tasks.length) this._clearInterval();
    else if (!this._interval) this._interval = this.client.setInterval(this.execute.bind(this), 60000);
  }

  *[Symbol.iterator]() {
    yield* this.tasks;
  }
}

module.exports = Schedule;
