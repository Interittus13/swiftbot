const { Event, coreutil } = require('../index');
// const Dashboard = require('../lib/dashboard/Dashboard');

let retries = 0;

module.exports = class extends Event {
  async run() {
    try {
      await this.client.fetchApplication();
    } catch (error) {
      if (++retries === 3) return process.exit();
      this.client.logger.warn(`Unable to Fetch Application at this time, retrying in 5 seconds. Retries left: ${retries - 3}`);
      await coreutil.wait(5000);
      return this.run();
    }

    this.client.mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>`);
    // this.client.dashboard = new Dashboard(this.client);
    // this.client.dashboard.start();

    this.client.logger.success(`Ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.\n${this.client.user.username} Dev is ready!`);
  }
};
