const config = {
  admins: [],
  support: [],
  token: 'process.env.Bot_Token',
  clientSecret: 'process.env.Bot_Secret',

  database: {
    db: 'database-name',
    id: '1tnxfr1',
    user: 'interittus13',
    pass: 'somerandompassword',
  },

  defaultSettings: {
    lang: 'en-US',
    prefix: 'c.',
    welcome: false,
    welcomeChannel: null,
    autoRole: false,
    role: null,
    adminRole: 'Administrator',
    modRole: 'Moderator',
    logs: false,
    logChannel: null,
    modLogs: false,
    modLogChannel: null,
    antiCaps: false,
    antiEmotes: false,
    antiInvites: false,
    antiWebLinks: false,
    antiMentionSpam: false,
    antiSwearing: false,
    nsfw: false,
    nsfwChannel: null,
    socialSystem: false,
    levelledRoles: false,
    starboard: false,
    starboardChannel: null,
  },

  swearWords: [], // global banned words

  emojis: {
    success: '<:success:373527456629522454>',
    error: '<:error:351676199182794766>',
    money: '<:money:470865378046902273>',
    loading: '<a:loading:625991694516486174>',
    redCross: '<:redCross:620254238244732929>',
    caution: '<:caution:862635941515755521>',
  },

  permLevels: [
    { level: 0,
      name: 'User',
      check: () => true,
    },

    { level: 2,
      name: 'Moderator',
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.id === message.settings.modRole);
          if (modRole && message.member.roles.has(modRole.id)) return true;
          else if (message.guild && message.member.permissions.has('BAN_MEMBERS') && message.member.permissions.has('KICK_MEMBERS')) return true;
        } catch (e) {
          return false;
        }
      }
    },
    { level: 3,
      name: 'Administrator',
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.id === message.settings.adminRole);
          if (adminRole && message.member.roles.has(adminRole.id));
          else if (message.guild && (message.member.permissions.has('MANAGE_GUILD') || message.member.permissions.has('ADMINISTRATOR'))) return true;
        } catch (e) {
          return false;
        }
      },
    },
    { level: 4,
      name: 'Server Owner',
      check: message => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false,
    },
    { level: 8,
      name: 'Bot Support',
      check: message => config.support.includes(message.author.id),
    },
    { level: 9,
      name: 'Bot Admin',
      check: message => config.admins.includes(message.author.id),
    },
    { level: 10,
      name: 'Bot Owner',
      check: message => message.client.appInfo.owner.id === message.author.id,
    },
  ],
};

module.exports = config;
