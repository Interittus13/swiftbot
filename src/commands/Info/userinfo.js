const { Command, coreutil: { capitalize } } = require('../../index');
const { MessageEmbed } = require('discord.js');

class Userinfo extends Command {
  constructor(...args) {
    super(...args, {
      name: 'userinfo',
      description: language => language.get('CMD_USERINFO_DESCRIPTION'),
      extended: language => language.get('CMD_USERINFO_EXTENDED'),
      usage: 'userinfo [@User]',
      aliases: ['whois'],
      example: ['userinfo @_Interittus13_',
        'userinfo'],
      requiredPerms: ['EMBED_LINKS'],
      cooldown: 20,
    });
    this.keyPerms = ['KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS'];
  }

  async acknowledge(message, member) {
    if (member.user.id === message.guild.ownerID) return 'Server Owner';
    else if (member.permissions.has('ADMINISTRATOR')) return 'Server Administrator';
    else if (member.permissions.has('MANAGE_GUILD')) return 'Server Manager';
    return null;
  }

  async run(message, args) {
    let member;
    if (args.length) member = await this.client.resolveMember(message, args.join(' '));
    else member = message.member;

    if (!member) return message.channel.send('User not found.');

    const userPermissions = [];
    for (let [key, value] of Object.entries(member.permissions.serialize())) {
      if (value === true && this.keyPerms.includes(key)) userPermissions.push(key);
      else continue;
    }

    const ack = await this.acknowledge(message, member);

    const embed = new MessageEmbed()
      .setAuthor(`Info about ${member.user.tag} `, member.user.displayAvatarURL())
      .setDescription(`${member.user}`)
      .setThumbnail(member.user.displayAvatarURL())
      .addField('ID', member.user.id, true)
      .addField('Nickname', member.nickname ? member.nickname : 'None', true)
      .addField('Joined Server', member.joinedAt.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'medium' }))
      .addField('Joined Discord', member.user.createdAt.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'medium' }))
      .addField(`Roles [${member.roles.cache.size - 1}]`, member.roles.cache.size - 1 ? `<@&${member.roles.cache.map(r => r.id).filter(r => r !== message.guild.roles.everyone.id).join('>, <@&')}>` : 'None')
      .setColor(member.displayHexColor);
    if (userPermissions.length) embed.addField('Permissions', capitalize(userPermissions.join(', ').toLowerCase()));
    if (ack) embed.addField('Acknowledgements', ack);

    message.channel.send({ embeds: [embed] });
  }
}

module.exports = Userinfo;
