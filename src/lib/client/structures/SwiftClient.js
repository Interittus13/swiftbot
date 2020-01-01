const { Client, Collection, BaseManager } = require('discord.js');
const { initClean } = require('../../core/util/util');
const { MENTION_REGEX } = require('../../core/util/constants');

const CommandStore = require('../../core/structures/CommandStore');
const EventStore = require('../../core/structures/EventStore');
const FinalizerStore = require('../../core/structures/FinalizerStore');
const InhibitorStore = require('../../core/structures/InhibitorStore');
const LanguageStore = require('../../core/structures/LanguageStore');
const MiddlewareStore = require('../../core/structures/MiddlewareStore');
const MonitorStore = require('../../core/structures/MonitorStore');
const ProviderStore = require('../../core/structures/ProviderStore');
const RouteStore = require('../../core/structures/RouteStore');
const SerializerStore = require('../../core/structures/SerializerStore');
const TaskStore = require('../../core/structures/TaskStore');

const PermissionLevels = require('../../core/permissions/Permissions');
const PermLevels = require('./PermissionLevels');

const GatewayDriver = require('../../core/settings/GatewayDriver');
const Scheduler = require('../../core/scheduler/schedule');
const SwiftConsole = require('../util/SwiftConsole');
const DashboardUser = require('./DashboardUser');
const Server = require('../../core/apiServer/Server');

class SwiftClient extends Client {
  constructor(options) {
    super(options);
    this.logger = new SwiftConsole(this);

    this.commands = new CommandStore(this);
    this.events = new EventStore(this);
    this.monitors = new MonitorStore(this);
    this.inhibitors = new InhibitorStore(this);
    this.finalizers = new FinalizerStore(this);
    this.languages = new LanguageStore(this);
    this.middlewares = new MiddlewareStore(this);
    this.providers = new ProviderStore(this);
    this.routes = new RouteStore(this);
    this.serializers = new SerializerStore(this);
    this.server = new Server(this);
    this.tasks = new TaskStore(this);

    this.pieceStores = new Collection();
    this.permissionLevels = this.validatePermLevels();
    this.gateways = new GatewayDriver(this);
    this.dashboardUsers = new BaseManager(this, undefined, DashboardUser);

    const { guilds, users, members, clientStorage } = this.options.gateways;
    const guildSchema = require('./schemas/defaultGuildSchema');
    const userSchema = require('./schemas/defaultUserSchema');
    const clientSchema = require('./schemas/defaultClientSchema');
    const memberSchema = require('./schemas/defaultMemberSchema');

    this.gateways.register('guilds', { ...guilds, schema: guildSchema })
      .register('users', { ...users, schema: userSchema })
      .register('members', { ...members, schema: memberSchema })
      .register('clientStorage', { ...clientStorage, schema: clientSchema });

    this.settings = null;
    this.application = null;
    this.mentionPrefix = null;

    this.registerStore(this.commands)
      .registerStore(this.events)
      .registerStore(this.monitors)
      .registerStore(this.inhibitors)
      .registerStore(this.finalizers)
      .registerStore(this.finalizers)
      .registerStore(this.languages)
      .registerStore(this.middlewares)
      .registerStore(this.providers)
      .registerStore(this.routes)
      .registerStore(this.serializers)
      .registerStore(this.tasks);

    this.schedule = new Scheduler(this);
    this.server.listen(this.options.dashboard.port);

    this.ready = false;
    this.on('ready', this._ready.bind(this));
  }

  get owners() {
    const owners = new Set();
    for (const owner of this.options.owners) {
      const user = this.users.cache.get(owner);
      if (user) owners.add(user);
    }
    return owners;
  }

  async fetchApplication() {
    this.application = await this.application.fetch();
    return this.application;
  }

  registerStore(store) {
    this.pieceStores.set(store.name, store);
    return this;
  }

  unregisterStore(storeName) {
    this.pieceStores.delete(storeName);
    return this;
  }

  validatePermLevels() {
    const permLevels = PermLevels;
    if (!(permLevels instanceof PermissionLevels)) throw new Error('permLevels must be an instance of the Permissions class.');
    if (permLevels.isValid()) return permLevels;
    throw new Error(permLevels.debug());
  }

  async login(token) {
    const loaded = await Promise.all(this.pieceStores.map(async store => `Loaded ${await store.loadAll()} ${store.name}.`))
      .catch((err) => {
        console.error(err);
        process.exit();
      });
    this.logger.log(loaded.join('\n'));

    await this.providers.init();
    await this.gateways.init();

    return super.login(token);
  }

  async _ready() {
    this.settings = this.gateways.clientStorage.get(this.user.id, true);
    this.gateways.clientStorage.cache.set(this.user.id, this);
    await this.gateways.sync();

    await Promise.all(this.pieceStores.filter(store => !['providers'].includes(store.name)).map(store => store.init()));
    initClean(this);

    this.ready = true;
    this.emit('swiftReady');
  }

  sweepMessages(lifetime = this.options.messageCacheLifetime, cmdLifetime = this.options.commandMessageLifetime) {
    const timems = lifetime * 1000;
    const cmdTimems = cmdLifetime * 1000;
    const now = Date.now();
    let channels = 0;
    let messages = 0;
    let cmdMessages = 0;

    for (const channel of this.channels.cache.values()) {
      if (!channel.messages) continue;
      channels += 1;

      channel.messages.cache.sweep((msg) => {
        if ((msg.command || msg.author === this.user) && now - (msg.editedTimestamp || msg.createdTimestamp) > cmdTimems) return cmdMessages += 1;
        if (!msg.command && msg.author !== this.user && now - (msg.editedTimestamp || msg.createdTimestamp) > timems) return messages += 1;
        return false;
      });
    }

    this.logger.debug(`Swept ${messages} messages older than ${lifetime} secs & ${cmdMessages} cmd messages older than ${cmdLifetime} secs in ${channels} channels.`);
    return messages;
  }

  // eslint-disable-next-line class-methods-use-this
  async resolveRole(message, search) {
    const roleSearch = search || message.content;
    if (!roleSearch || typeof roleSearch !== 'string') return;

    // search by Regex
    if (roleSearch.match(MENTION_REGEX.role)) {
      const [, roleID] = roleSearch.match(MENTION_REGEX.role);
      const role = message.guild.roles.cache.get(roleID);
      if (role) return role;
    }

    // search by ID
    if (message.guild.roles.cache.has(search)) {
      const role = message.guild.roles.cache.get(search);
      if (role) return role;
    }

    // search by @ Name
    if (message.guild.roles.cache.some(rol => `@${rol.name}` === search || rol.name === search)) {
      const role = message.guild.roles.cache.find(r => `@${r.name}` === search || r.name === search);
      if (role) return role;
    }

    return;
  }

  // eslint-disable-next-line class-methods-use-this
  async resolveMember(message, search) {
    const memberSearch = search || message.content;
    if (!memberSearch || typeof memberSearch !== 'string') return;

    // search by Regex
    if (memberSearch.match(MENTION_REGEX.userOrMember)) {
      const [, userID] = memberSearch.match(MENTION_REGEX.userOrMember);
      const member = await message.guild.members.fetch(userID).catch(() => {});
      if (member) return member;
    }

    // search by ID
    if (await message.guild.members.fetch(search).catch(() => {})) {
      const member = await message.guild.members.fetch(search);
      if (member) return member;
    }

    // search by @ Name
    await message.guild.members.fetch({ query: search });
    if (message.guild.members.cache.some(mem => mem.user.tag === search || mem.user.username === search)) {
      const member = message.guild.members.cache.find(mem => mem.user.tag === search || mem.user.username === search);
      if (member) return member;
    }

    return;
  }

  // eslint-disable-next-line class-methods-use-this
  async resolveChannel(message, search, channelType) {
    const channelSearch = search || message.content;
    if (!channelSearch || typeof channelSearch !== 'string') return;

    // search by regex
    if (channelSearch.match(MENTION_REGEX.channel)) {
      const [, channelID] = channelSearch.match(MENTION_REGEX.channel);
      const channel = message.guild.channels.cache.get(channelID);
      if (channel || (channelType && channel.type === channelType)) return channel;
    }

    // search by id
    if (message.guild.channels.cache.has(search)) {
      const channel = message.guild.channels.cache.get(search);
      if (channel || (channelType && channel.type === channel)) return channel;
    }

    // search by # name
    if (message.guild.channels.cache.some(chan => `#${chan.name}` === search || chan.name === search)) {
      const channel = message.guild.channels.cache.find(chan => `$${chan.name}` === search || chan.name === search);
      if (channel || (channelType && channel.type === channelType)) return channel;
    }

    return;
  }
}

module.exports = SwiftClient;
