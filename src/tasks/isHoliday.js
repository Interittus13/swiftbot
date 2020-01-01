const { Task, Moment } = require('../index');
const holidays = require('../lib/client/constants/holidays.json');

module.exports = class extends Task {
  async run() {
    const date = new Moment('MM-DD').display();

    await this.client.settings.reset('holiday');

    const isThere = this.client.settings.holiday;
    if (holidays[date] && !isThere.includes(holidays[date])) this.client.settings.update('holiday', holidays[date]);
    console.log(this.client.settings.holiday);
  }

  // async init() {
  //   if (!this.client.schedule.tasks.some(task => task.taskName === 'isHoliday')) {
  //     await this.client.schedule.create('isHoliday', '@daily');
  //   }
  // }
};
