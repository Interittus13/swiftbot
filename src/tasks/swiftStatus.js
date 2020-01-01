const { Task } = require('../index');

module.exports = class extends Task {
  async run() {
    const games = [
      { text: 'for ?help', type: 'WATCHING' },
      { text: 'v3.0-dev', type: 'PLAYING' },
      { text: 'with _Interittus13_!', type: 'PLAYING' },
      // { text: `in ${this.client.guilds.cache.size.toLocaleString()} Guilds`, type: 'PLAYING' },
      // { text: `${this.client.users.cache.size.toLocaleString()} Users`, type: 'WATCHING' },
    ];

    let status = '';
    
    // TODO: loop iteration for expanding arrays
    const holidays = this.client.settings.holiday;
    if (games.includes(holidays)) status = games.random();

    games.push({ text: holidays[0], type: 'PLAYING' });
    status = games.random();

    this.client.user.setActivity(status.text, { type: status.type });
  }

  async init() {
    if (!this.client.schedule.tasks.some(task => task.taskName === 'swiftStatus')) {
      await this.client.schedule.create('swiftStatus', '*/1 * * * *');
    }
  }
};
