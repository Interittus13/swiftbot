const { Language, config: { emojis } } = require('../index');

module.exports = class extends Language {
  constructor(...args) {
    super(...args);
    this.language = {
      DEFAULT: key => `\`${key}\` has not been localized for en-US yet.`,
      DEFAULT_LANGUAGE: 'Default Language',

      // Utils
      PREFIX_INFO: (prefix = `@${this.client.user.tag}`) => `The prefix for this server is: ${Array.isArray(prefix) ?
        `${prefix.map(p => `\`${p}\``).join(', ')}` : `\`${prefix}\``}`,
      PLEASE_WAIT: str => `${emojis.loading} Please wait${str && str.length ? ` ${str}...` : '...'}`,

      // Errors
      NO_DESCRIPTION: 'No description provided.',
      NO_EXTENDED_DESCRIPTION: 'No Information provided.',
      ERR_NSFW_DISABLED: '🔞 **NSFW is disabled in this server.**',
      ERR_NSFW_CHANNEL: '🖕 **This channel is not NSFW enabled.**',
      ERR_SOCIAL_DISABLED: `${emojis.error} **Social System is disabled in this server.**`,
      ERR_INVALID_MEMBER: 'Please mention a valid Member.',
      ERR_USER_ISBOT: user => `**${user}**, Bots don't rely on credits and levels.`,
      ERR_OCCURED: `${emojis.error} An error has occurred, please try again in a few minutes.`,
      ERR_FETCHING_API: `${emojis.error} Could not find any results.`,
      ERR_INVALID_NUMBER: `${emojis.error} Please enter a valid number.`,
      ERR_INSUFFICIENT_CREDITS: '🤦**Insufficient funds!** Are you plannning to go bankrupt?',
      ERR_INVALID_CHANNEL: channel => `${channel} is not a valid channel.`,
      ERR_INVALID_ROLE: role => `${role} is not a valid role.`,

      // Inhibitors
      INHIBITOR_MISSING_BOT_PERMS: perms => `Oops... I don't have \`${perms}\` permissions to run this command.`,
      INHIBITOR_DISABLED_GUILD: cmd => `The command **${cmd}** has been disabled by an admin in this guild.`,
      INHIBITOR_COOLDOWN: (remaining, guildCooldown) => `${guildCooldown ? 'Someone has' : 'You have'} already used this command. You can use this command again in ${remaining} second${remaining === 1 ? '' : 's'}.`,
      INHIBITOR_REQUIRED_SETTINGS: settings => `The guild is missing **${settings.join(', ')}** guild setting${settings.length !== 1 ? 's' : ''} & thus cmd cannot run.`,
      INHIBITOR_RUNIN: type => `This command is only available in ${type} channels.`,
      INHIBITOR_MODULE_DISABLED: module => `The ${module} module is disabled on this server.`,

      // Monitors'
      MONITOR_AFK_ISAFK: (username, afk) => `>>> **${username}** is currently AFK.`,
      MONITOR_AFK_REMOVED: username => `>>> **Welcome Back *${username}*, I've removed you from AFK.**`,
      MONITOR_INVITE_DETECTED: member => `${emojis.error} ${member} Discord server invites are not allowed.`,
      MONITOR_URL_DETECTED: member => `${member} No web URL allowed.`,

      // Administration Folder Commands
      // Config Command
      CMD_CONFIG_DESCRIPTION: 'Displays the Swift configuration of a server.',

      // Manage Admins Command
      CMD_MADMINS_DESCRIPTION: '',
      CMD_ADMINS_EXTENDED: '',
      CMD_ADMINS_ARGS_MISSING: `${emojis.error} Provide a valid user name or role name.`,
      CMD_ADMINS_ARGS_INVALID: admin => `${emojis.error} **${admin}** is not a valid Role & Member.`,
      CMD_ADMINS_EXISTS: memberOrRole => `${emojis.caution} ${memberOrRole} is already an Administrator.`,
      CMD_ADMINS_MISSING: memberOrRole => `${memberOrRole} is not an Administrator.`,
      CMD_ADMINS_ADDED: memberOrRole => `${emojis.success} ${memberOrRole} has been added as an Administrator.`,
      CMD_ADMINS_REMOVED: memberOrRole => `${emojis.success} ${memberOrRole} has been removed as an Administrator.`,

      // Manage Moderators Command
      CMD_MODS_DESCRIPTION: '',
      CMD_MODS_EXTENDED: '',
      CMD_MODS_ARGS_MISSING: `${emojis.error} Provide a valid user name or role name.`,
      CMD_MODS_ARGS_INVALID: mods => `${emojis.error} **${mods}** is not a valid Role & Member.`,
      CMD_MODS_EXISTS: memberOrRole => `${emojis.caution} ${memberOrRole} is already a Moderator.`,
      CMD_MODS_MISSING: memberOrRole => `${memberOrRole} is not a Moderator.`,
      CMD_MODS_ADDED: memberOrRole => `${emojis.success} ${memberOrRole} has been added as a Moderator.`,
      CMD_MODS_REMOVED: memberOrRole => `${emojis.success} ${memberOrRole} has been removed a an Moderator.`,

      // Disable Command
      CMD_DISABLECMD_DESCRIPTION: '',
      CMD_DISABLECMD_ENABLED: cmd => `Command **${cmd}** has been successfully enabled.`,
      CMD_DISABLECMD_DISABLED: cmd => `Command **${cmd}** has been successfully disabled.`,

      // Levelled Roles Command
      CMD_LEVELROLE_DESCRIPTION: 'Allows you to manage Levelled roles.',
      CMD_LEVELROLE_EXTENDED: 'Members can get roles when they level up.\n           Excluded roles: If user have a role that is excluded then they won\'t be assigned a new role when they level up.',

      // Set Prefix Command
      CMD_PREFIX_DESCRIPTION: 'Change a guild\'s prefix for SwiftBot.',
      CMD_PREFIX_GUILD: prefix => `Server prefix is: ${prefix}`,
      CMD_PREFIX_UPDATED: prefix => `${emojis.success} Successfully updated the guild's prefix to: ${prefix}`,

      // Set Lang Command
      CMD_SETLANG_DESCRIPTION: 'Allows you to change Bot language.',
      CMD_SETLANG_USING: 'SwiftBot is already communicating in English.',
      CMD_SETLANG_SUCCESS: lang => `Swift will now communicate in ${lang}.`,
      CMD_SETLANG_ERROR: `${emojis.error}`,
      CMD_SETLANG_LIST: prefix => ['Select from Languages you want **Swift** to Speak in.',
        '',
        ':flag_us: English (en-US)',
        ':flag_in: Hindi (hi-IN)',
        '',
        `Type \`${prefix}setlang <Name>\` to change your language.`],


      // Auto Mod Command
      CMD_AUTOMOD_DESCRIPTION: 'Allows you to enable/disable auto moderation settings.',
      CMD_AUTOMOD_EXTENDED: 'When Enabled server invites, web links, swear words, CAPS messages will be auto deleted',

      // Auto Role Command
      CMD_AUTOROLE_DESCRIPTION: 'Allows you to enable/disable/set Autorole.',
      CMD_AUTOROLE_EXTENDED: 'If Enabled, New Users will be given the role on joining the server.',
      CMD_AUTOROLE_TOGGLE: (toggle, role) => `>>> ${emojis.success} Autorole ${toggle ? `enabled!\n${role ? '' : 'Autorole might not work as you haven\'t added any Roles to autorole'}` : 'disabled!'}`,

      // Economy Command
      CMD_ECONOMY_DESCRIPTION: 'Allows you to enable/disable Social settings.',
      CMD_ECONOMY_EXTENDED: 'When Enabled, Users can lavel up by participating in server.',
      CMD_PERSISTENCE_TOGGLE: toggle => `Persistence ${toggle ? 'activated' : 'deactivated.'}`,
      CMD_PERSISTENCE_IGNORE: channel => `Persistence channel updated to <#${channel}>`,

      // Logs Command
      CMD_LOGS_DESCRIPTION: 'Allows you to enable/disable logging settings.',
      CMD_LOGS_EXTENDED: ['Log channel will store information such as -', '> Channel created/deleted/updated.', '> Role created/deleted/updated.', '> Messages deleted/updated.'].join('\n'),
      CMD_LOGS_CHANNEL_UPDATED: channel => `Logs channel updated to <#${channel}>`,
      CMD_LOGS_ENABLED: channel => `Logs are activated and will stored in <#${channel}>`,
      CMD_LOGS_TOGGLE: toggle => `Logs ${toggle ? 'activated' : 'deactivated.'}`,

      // ModLogs Command
      CMD_MODLOGS_DESCRIPTION: 'Allows you to enable/disable mod logs settings.',
      CMD_MODLOGS_EXTENDED: ['Mod Log will store information such as -', '> Member warning.', '> Member Kicked.', '> Member Muted/Unmuted.', '> Member Ban/Unban.'].join('\n'),
      CMD_MODLOGS_CHANNEL_UPDATED: channel => `Modlogs channel updated to <#${channel}>`,
      CMD_MODLOGS_ENABLED: channel => `Modlogs are activated and will stored in <#${channel}>`,
      CMD_MODLOGS_TOGGLE: toggle => `Modlogs ${toggle ? 'activated' : 'deactivated.'}`,

      // Starboard Command
      CMD_PINBOARD_DESCRIPTION: 'Allows you to enable/disable/set starboard channel.',
      CMD_PINBOARD_EXTENDED: 'Starboard is like a display board which display messages that users found funny/stupid.',

      // Fun Folder Commands
      // Advice Command
      CMD_ADVICE_DESCRIPTION: 'Gives you good advices.',

      // Cat Command
      CMD_CAT_DESCRIPTION: 'Send random cat.',

      // Cat Girl Command
      CMD_CATGIRL_DESCRIPTION: 'Send random Nekos Image.',

      // Choose Command
      CMD_CHOOSE_DESCRIPTION: 'Confused? Let swift choose for you.',
      CMD_CHOOSE_EXTENDED: 'Picks a random element from given options.',
      CMD_CHOOSE_ERROR: 'You gave me only one choice to choose from, Noob',
      CMD_CHOOSE_SUCCESS: choice => `I choose **${choice}**`,

      // Fact Command
      CMD_FACT_DESCRIPTION: 'Sends a random fact.',
      CMD_FACT_EXTENDED: 'Gives you some interresting facts!',

      // FMyLife Command
      CMD_FML_DESCRIPTION: 'Display a random FML story.',
      CMD_FML_ERROR: `${emojis.error} Something went wrong, try again in a few moments. FML.`,

      // Gif Command
      CMD_GIF_DESCRIPTION: 'Send GIFs from Giphy.',
      CMD_GIF_EXTENDED: 'Send requested or a random GIF.',

      // Magic8Ball Command
      CMD_8BALL_DESCRIPTION: 'Ask magic ball a question!',
      CMD_8BALL_EXTENDED: 'This will answer any question in magic 8 ball style.',

      // Math Command
      CMD_MATH_DESCRIPTION: 'Calculate anything.',
      CMD_MATH_EXTENDED: 'Solve simple or complex math equations.',
      CMD_MATH_ERROR: 'error evaluating expression',
      CMD_MATH_SUCCESS: 'your expression gives out:',

      // Roast Command
      CMD_ROAST_DESCRIPTION: 'Roast someone.',

      // Tweet Command
      CMD_TWEET_DESCRIPTION: 'Tweet as someone without using Twitter.',
      CMD_TWEET_EXTENDED: 'Generate a tweet of a person of your choice from Twitter!',
      CMD_TWEET_USER_ERROR: 'You have to enter twitter nickname!',
      CMD_TWEET_TEXT_ERROR: `${emojis.error} You must enter a message!`,
      CMD_TWEET_SECCESS: user => `New tweet published by ${user}`,

      // Yo Momma Command
      CMD_YOMOMMA_DESCRIPTION: 'Returns a random Yo momma joke.',
      CMD_YOMOMMA_ERROR: '❌ Something went wrong, can\'t fetch yomomma jokes.',
      CMD_YOMOMMA_SUCCESS: joke => `📢 **Yomomma joke:** ${joke} \n**Wasn't that funny?** 😝`,

      // Fun Folder Commands
      // Rock Paper Scissor Command
      CMD_RPS_DESCRIPTION: 'Play Rock paper scissros.',

      // Slots Command
      CMD_SLOTS_DESCRIPTION: 'Try your luck with slot machine.',
      CMD_SLOTS_LESS: points => `🤦**Insufficient funds.** You only have **₷${points}** in your pocket.`,
      CMD_SLOTS_LOST: (user, bid) => `**${user}** used **₷${bid}** and have lost.`,
      CMD_SLOTS_WIN: (user, bid, total) => `**${user}** used **₷${bid}** and have won **$${total}**.`,

      // Trivia Command
      CMD_TRIVIA_DESCRIPTION: 'Take a quiz to check your Brain Level.',
      CMD_TRIVIA_EXTENDED: 'Ready to wrack your brain?',

      // Info Folder Commands
      // Avatar Command
      CMD_AVATAR_DESCRIPTION: 'Gets a user\'s Avatar.',

      // Channelinfo Command
      CMD_CHNLINFO_DESCRIPTION: 'Get detailed information on a channel.',

      // Bot Info Command
      CMD_INFO_DESCRIPTION: 'Gives useful Bot info.',

      // MyLevel Command
      CMD_MYLEVEL_DESCRIPTION: 'Tells your permission level for the current server.',
      CMD_MYLEVEL_RESPONSES: (user, perms, level) => [
        `You're only level **${perms}**, that makes you a **${level}**.`,
        `Your permission level is: **${perms}**, means you are a **${level}**.`,
        `Here you go **${user}**!, It's **${level}**, level **${perms}**.`,
        `**${user}**, You're only level **${perms}**! Even I'm better than a **${level}**.`,
      ],

      // Ping Command
      CMD_PING_DESCRIPTION: 'Ping the Bot.',
      CMD_PING_EXTENDED: 'Used to test Bot\'s response time.',
      CMD_PING_RESPONSE: (user, ms) => [
        `Pong! **${user}**, I've responded in **${ms}ms**.`,
        `Pong! **${user}**, You wasted **${ms}ms** of my time, ERGH!`,
        `Pong! Yes I'm here **${user}**, and it took me **${ms}ms** to respond!`,
        `Ugh, again? Yes, I'm alive.. and it took **${ms}ms**`,
        `Pong! Here you go **${user}**, I've responded in **${ms}ms**.`,
        `Pong! Wait! **${user}**, Is this working? Responded in **${ms}ms**.`,
        `Pong! **${user}**, you want my ping? O-okay, it's okay if it's you. ❤ **${ms}ms**`,
      ],

      // Role Info Command
      CMD_ROLEINFO_DESCRIPTION: 'Shows information about a role.',
      CMD_ROLEINFO_ERROR: 'Provide a vaild role name.',

      // Server Info Command
      CMD_SERVERINFO_DESCRIPTION: 'Get Server information.',

      // UP Time Command
      CMD_UPTIME_DESCRIPTION: 'Get Bot uptime.',

      // User Info Command
      CMD_USERINFO_DESCRIPTION: 'Get user information.',
      CMD_USERINFO_EXTENDED: 'Get info either for a mentioned user or for a message author.',

      // Giveaway Folder Commands
      CMD_GIVEAWAY_DESCRIPTION: 'Starts a new giveaway in the current channel.',
      CMD_GIVEAWAY_EXTENDED: 'Giveaway time can be in seconds, minutes, hours, days. (10s/5m/1h/2d).',
      CMD_GIVEAWAY_DELETE_DESCRIPTION: 'Deletes ongoing giveaway.',
      CMD_GIVEAWAY_EDIT_DESCRIPTION: 'Edits an ongoing giveaway',
      CMD_GIVEAWAY_REROLL_DESCRIPTION: 'Rerolls a winner',

      // Moderation Folder Commands
      // Announce Command
      CMD_ANNOUNCE_DESCRIPTION: 'Let the bot send embed message.',
      CMD_ANNOUNCE_EXTENDED: 'Send a message to same or a different channel.',

      // Ban Command
      CMD_BAN_DESCRIPTION: 'Bans the mentioned user.',
      CMD_BAN_EXTENDED: 'Bans the user permanently and delete last 2 days messages.',

      // Ban Words Command
      CMD_BANWORDS_DESCRIPTION: 'Blacklist a word.',
      CMD_BAN_NO_USER: 'You must mention someone to ban.',
      CMD_BAN_USER_MISS: `${emojis.error} can't find user.`,
      CMD_BAN_NO_REASON: '✋ **You can\'t ban a user without a reason.**',

      // History Command
      CMD_HISTORY_DESCRIPTION: 'Bans the mentioned user.',

      // Kick Command
      CMD_KICK_DESCRIPTION: 'Kicks a mentioned user.',
      CMD_KICK_EXTENDED: 'Kicks a user from the server.',
      CMD_KICK_NO_USER: 'You must mention someone to kick.',
      CMD_KICK_USER_MISS: `${emojis.error} can't find user.`,
      CMD_KICK_NO_REASON: '✋ **You can\'t kick a user without any reason.**',

      // LockDown Command
      CMD_LOCKDOWN_DESCRIPTION: 'Locks a channel.',
      CMD_LOCKDOWN_EXTENDED: '',
      CMD_LOCKDOWN_ERROR: channel => `${emojis.error} ${channel} is already locked.`,
      CMD_LOCKDOWN_MSG: msg => `>>> ${msg}`,
      CMD_LOCKDOWN_SUCCESS: channel => `${emojis.success} ${channel} Channel Locked.`,

      // Mute Command
      CMD_MUTE_DESCRIPTION: 'Mutes a mentioned user for a given time (defaut time 1 hour).',
      CMD_MUTE_EXTENDED: 'Takes away permission for Type and Speak from a mentioned user.',
      CMD_MUTE_NO_USER: 'You must mention someone to mute.',

      // Purge Command
      CMD_PURGE_DESCRIPTION: 'Purge x number of messages from a channel. [limit 100]',
      CMD_PURGE_EXTENDED: 'Purge messages for a mentioned user, links, attachments.',
      CMD_PURGE_LIMIT: 'Only 100 messages can be deleted at a time.',
      CMD_PURGE_ERROR: "I tried my best but some messages were older than 14 days so I couldn't delete them!",
      CMD_PURGE_RESPONSES: amount => [
        `🗑 Deleted **${amount}** messages.`,
        `🗑 **${amount}** Messages deleted!`,
        `There goes your **${amount}** messages.`,
        `Whoops... I think I deleted **${amount}** messages!!`,
        `Those **${amount}** message's weren't Important? I think🤔!`,
      ],

      // Role Command
      CMD_ROLE_DESCRIPTION: 'Give/Remove role to a user.',

      // Say Command
      CMD_SAY_DESCRIPTION: 'Bot echos your words.',
      CMD_SAY_EXTENDED: 'Make the bot say something.',

      // Soft Ban Command
      CMD_SBAN_DESCRIPTION: 'Bans the mentioned user and Unbans them.',
      CMD_SBAN_EXTENDED: 'Hardkicks the user and delete last 1 day messages.',
      CMD_SBAN_NO_USER: 'You must mention someone to softban.',
      CMD_SBAN_USER_MISS: `${emojis.error} can't find user.`,

      // Unban Command
      CMD_UNBAN_DESCRIPTION: 'Unbans the mentioned user.',
      CMD_UNBAN_EXTENDED: 'Unban the banned user from the server.',
      CMD_UNBAN_NO_USER: 'You must mention someone to Unban.',
      CMD_UNBAN_USER_MISS: `${emojis.error} can't find user.`,

      // Lift LockDown Command
      CMD_UNLOCK_DESCRIPTION: 'Unlocks a previously locked channel.',
      CMD_UNLOCK_EXTENDED: '',
      CMD_UNLOCK_ERROR: channel => `${emojis.error} ${channel} is already unlocked.`,
      CMD_UNLOCK_MSG: msg => `>>> ${msg}`,
      CMD_UNLOCK_SUCCESS: channel => `${emojis.success} ${channel} Channel Unlocked.`,

      // Unmute Command
      CMD_UNMUTE_DESCRIPTION: 'Unmutes the mentioned user.',
      CMD_UNMUTE_EXTENDED: 'Gives back permissions for Type and Speak from a mentioned muted user.',
      CMD_UNMUTE_NO_USER: 'You must mention someone to Unmute.',

      // Warn Command
      CMD_WARN_DESCRIPTION: 'Issues a warning to the mentioned user.',
      CMD_WARN_NO_USER: 'You must mention someone to warn.',
      CMD_WARN_USER_MISS: `${emojis.error} can't find user.`,

      // Developer Folder Commands
      // Blacklist Command
      CMD_BLACKLIST_DESCRIPTION: 'Blocks or unblocks users and guilds from the bot.',
      CMD_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
        usersAdded.length ? `**Users Added** ${usersAdded.join(', ')}` : '',
        usersRemoved.length ? `**Users Removed** ${usersRemoved.join(', ')}` : '',
        guildsAdded.length ? `**Guilds Added** ${guildsAdded.join(', ')}` : '',
        guildsRemoved.length ? `**Guilds Removed** ${guildsRemoved.join(', ')}` : '',
      ].filter(val => val !== '').join('\n'),
      // Conf Command
      CMD_CONF_DESCRIPTION: 'Manage bot Default settings.',
      CMD_CONF_NOEXT: key => `The key **${key}** doesn't exist.`,
      CMD_CONF_GET: (key, value) => `The value for key **${key}** is \`${value}\``,
      CMD_CONF_SERVER: (key, list) => `**Guild Settings${key}**\n${list}`,
      CMD_CONF_UPDATED: (key, res) => `Successfully updated the key **${key}**: \`${res}\``,
      CMD_CONF_NOCHANGE: key => `The value for **${key}** was already same.`,

      // Eval Command
      CMD_EVAL_DESCRIPTION: 'Evaluates arbitrary javascript.',

      // Exec Command
      CMD_EXEC_DESCRIPTION: 'Run arbitrary commands.',

      // Load Command
      CMD_LOAD_FAIL: 'The file does not exist, or an error occured while loading your while.',
      CMD_LOAD_SUCCESS: (type, name) => `Successfully loaded ${type}: ${name}.`,
      CMD_LOAD_ERROR: (type, name, error) => `Failed to load ${type}: ${name}. Reason: ${error}`,

      // Reload Command
      CMD_RELOAD_DESCRIPTION: 'Reloads a command or a event after been modified.',
      CMD_RELOAD_ALL: type => `Reloaded all ${type}.`,
      CMD_RELOAD_ITEM: (type, name) => `Reloaded ${type}: ${name}.`,
      CMD_RELOAD_FAILED: (type, name) => `Failed to reload ${type}: ${name}.`,

      // Status Command
      CMD_STATUS_DESCRIPTION: 'Manages Bot Palying Activity.',

      // Test Command
      CMD_TEST_DESCRIPTION: 'Test any JS code.',
      CMD_TEST_EXTENDED: 'Test any command here before releasing.',

      // Social Folder Commands
      // Level Up Responses
      LEVEL_UP: (user, level) => [`Congratulations ${user}, You just levelled up to ${level}.`,
        `You've levelled up ${user}, you're now on ${level}.`,
        `${user}, don't forget me now because you're ${level}.`,
        `Thanks ${user}, for being active! You've leveled up to ${level}!`,
      ],

      // Level Down response
      LEVEL_DOWN: (user, level) => `**${user}** you just Levelled Down to **Level ${level}**`,

      // Profile Card Command
      CMD_PROFILE_CARD_DESCRIPTION: 'Customize your SwiftBot profile by buying and choosing different profile cards.',
      CMD_PROFILE_CARD_OWNED: 'You already owned that profile card.',
      CMD_PROFILE_CARD_BUY: card => `**🛒 You just bought \`${card}\` profile card.**`,
      CMD_PROFILE_CARD_UNOWNED: 'You don\'t own that profile card.',
      CMD_PROFILE_CARD_ALREADY_USING: 'That is already your current profile card.',
      CMD_PROFILE_CARD_SWITCH: card => `**Your Profile card is now set to: \`${card}\`**`,
      CMD_PROFILE_CARD_UNAVAILABLE: id => `${emojis.error} Can't find any profile card with **id ${id}**`,

      // Balance Command
      CMD_BAL_DESCRIPTION: 'Check your or someone\'s Swift Money(₷) balance.',
      CMD_BAL_SELF: (user, score) => `**${user}**, You have a balance of ${emojis.money}**${score}**.`,
      CMD_BAL_SOMEONE: (user, score) => `**${user}**, has a balance of ${emojis.money}**${score}**.`,

      // Daily Command
      CMD_DAILY_DESCRIPTION: 'Claim or Donate your daily Swift Money(₷) credits.',
      CMD_DAILY_EXTENDED: 'Extra credits will be given if donated to someone else.',
      CMD_DAILY_WAIT: (user, time) => `**${user}, Your daily credits refreshes in ${time}.**`,
      CMD_DAILY_SELF: (user, amt) => `**${user}, You have recieved your ${emojis.money}${amt} daily credits!**`,
      CMD_DAILY_DONATE: (user, amt, payee) => `**${user}, You have donated your ${emojis.money}${amt} daily credits to ${payee}!**`,

      // Leaderboard Command
      CMD_LBOARD_DESCRIPTION: 'Display top 10 Active members.',
      CMD_LBOARD_INACTIVE: '👻 There is no leaderboard in the server, maybe its a dead place???',

      // Pay Command
      CMD_PAY_DESCRIPTION: 'Transfer your Swift Money(₷) credits.',
      CMD_PAY_URSELF: `${emojis.error} You can't pay to yourself, why did you even try?`,
      CMD_PAY_INVALID_AMT: 'Don\'t try to rob, enter an amount to be paid',
      CMD_PAY_INSUFFICIENT_AMT: '🤦**Insufficient funds.** Are you plannning to go bankrupt?',
      CMD_PAY_SUCCESS: '',

      // Profile Command
      CMD_PROFILE_DESCRIPTION: 'View your or someone\'s server profile card.',

      // Rank Command
      CMD_RANK_DESCRIPTION: 'View your or someone\'s server rank.',
      CMD_RANK_EXTENDED: 'Display User\'s current level and ₷ points.',
      CMD_RANK_SELF: (user, level, xp) => `**${user}**, You are on **Level ${level}** with **${xp} XP**`,
      CMD_RANK_SOMEONE: (user, level, xp) => `${user}** is on **Level ${level}** with **${xp} XP**`,

      // Set About Command
      CMD_ABOUT_DESCRIPTION: 'Set the text shown on your profile about box. Maximum of 150 characters. Leave blank to reset it.',
      CMD_ABOUT_LIMIT: `${emojis.error} You can't use more than 150 words.`,
      CMD_ABOUT_SUCCESS: `${emojis.success} Your About box has been successfully updated.`,

      // Steal Command
      CMD_STEAL_DESCRIPTION: 'Steal your friends.',
      CMD_STEAL_SELF: `${emojis.error} You can't rob yourself`,
      CMD_STEAL_NO_AMT: 'Please enter a valid amount to be robbed',
      CMD_STEAL_MEMBER_AMT_ERROR: user => `**${user}** doesn't have enough credits.`,
      CMD_STEAL_NO_MONEY: user => `**${user}** you don't have enough credits to attempt this robbery!`,
      CMD_STEAL_WON: (robber, user, stealed) => [
        `Congratulations **${robber}**! The police weren't fast enough to stop you from stealing ${emojis.money} **${stealed}** from **${user}** !`,
        `**${user}**? Bad news. You just got robbed ${emojis.money} **${stealed}** by **${robber}**!`,
      ],
      CMD_STEAL_LOOSE: (robber, user, lose, won) => [
        `🚔 The police caught **${robber}** in the act, impossible to deny, your fine is ${emojis.money} **${lose}**. ${emojis.money} **${won}** will be paid to **${user}**.`,
        `🚓 Bad news **${robber}**, **${user}** called the police in time. Your fine is ${emojis.money} **${lose}** and ${emojis.money} **${won}** will be paid to **${user}**.`,
        `🔐 You accidentally raided the wrong bedroom **${robber}**, resulting in being sent to jail with a fine ${emojis.money} **${lose}** and ${emojis.money} ${won} paid to **${user}**.`,
      ],

      // Store Command
      CMD_STORE_DESCRIPTION: 'Buy/Sell Roles through Role Store.',
      CMD_STORE_EXTENDED: 'Server Roles can be managed in Store.',

      // Support Folder Commands
      // Close Command
      CMD_CLOSE_DESCRIPTION: 'Closes a support ticket.',
      CMD_CLOSE_EXTENDED: 'Closes a support ticket for a certain user.',

      // Help Command
      CMD_HELP_DESCRIPTION: 'Display all Bot commands.',
      CMD_HELP_EXTENDED: 'Show all available commands for your permission level.',

      // Reply Command
      CMD_REPLY_DESCRIPTION: 'Reply to a support message in support channel.',
      CMD_REPLY_EXTENDED: 'Support Guild use only.',

      // Support Command
      CMD_SUPPORT_DESCRIPTION: 'Contact Bot support for bug reports, feedbacks, questions & suggestions.',
      CMD_SUPPORT_EXTENDED: 'To be used via DM.',

      // Tag Command
      CMD_TAG_DESCRIPTION: 'Tag display and management.',

      // System Folder Commands
      // Changelog Command
      CMD_CHANGELOG_DESCRIPTION: 'Display Swift\'s Update logs.',
      CMD_CHANGELOG_EXTENDED: 'Fetches 10 recent Swift\'s Updates from her Home server',

      // Set Command
      CMD_SET_DESCRIPTION: 'View or change settings of your server.',

      // Setup Command
      CMD_SETUP_DESCRIPTION: 'Step by step Server Settings.',

      // Stats Command
      CMD_STATS_DESCRIPTION: 'Gives useful bot stats.',

      // Utilities Folder Commands
      // AFK Command
      CMD_AFK_DESCRIPTION: 'Display an AFK message whenever your are mentioned.',
      SET_AFK_SUCCESS: user => `**${user}**, I've set you AFK`,
      AFK_NOTIFY: '',

      // Google Command
      CMD_GOOGLE_DESCRIPTION: 'Find something on google.',
      CMD_GOOGLE_EXTENDED: 'searches Google for your question',

      // Remind Command
      CMD_REMIND_DESCRIPTION: 'Need to be reminded about something? This is the command.',

      // Rotten Tomatoes Command
      CMD_RT_DESCRIPTION: 'Get movie details from Rotten Tomatoes.',

      // Urban Command
      CMD_URBAN_DESCRIPTION: 'Search meaning of a word in Urban Dictionary.',

      // Weather Command
      CMD_WEATHER_DESCRIPTION: 'Shows you the weather of city/location.',

      // Wikipedia Command
      CMD_WIKI_DESCRIPTION: 'Search anything in Wikipedia.',

    };
  }
};
