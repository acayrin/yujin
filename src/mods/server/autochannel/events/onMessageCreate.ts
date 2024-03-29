import Eris from 'eris';

import AutoChannel from '..';
import Yujin from '../../../../core/yujin';

export async function onMessageCreate(
	ac: AutoChannel,
	msg: Eris.Message | Eris.CommandInteraction,
	opt: { command: string; args: string[]; mod: Yujin.Mod },
) {
	if (!opt.command) return;

	const _help = new Eris.Embed()
		.setColor(opt.mod.bot.color)
		.setTitle(`How to use ${ac.name}`)
		.setDescription(`${opt.mod.bot.prefix}autochannel <subcommand> [args]`)
		.addField('``rename``', 'short: ``name``\nusage: ``rename <name>``\ndesc: rename voice channel', true)
		.addField('``kick``', 'short: ``kk``\nusage: ``kick <user>``\ndesc: kick a user from channel', true)
		.addField('\u200B', '\u200B')
		.addField(
			'``bitrate``',
			'short: ``br``\nusage: ``bitrate <bitrate>``\ndesc: change voice channel bitrate',
			true,
		)
		.addField('``lock``', 'short: ``lk``\nusage: ``lock``\ndesc: lock voice channel', true)
		.addField('\u200B', '\u200B')
		.addField('``switch``', 'short: ``sw``\nusage: ``switch <user>``\ndesc: switch channel owner', true)
		.addField('``incognito``', 'short: ``in``\nusage: ``incognito``\ndesc: hide voice channel', true)
		.addField('\u200B', '\u200B')
		.addField('``limit``', 'short: ``lm``\nusage: ``limit <amount>``\ndesc: limit user amount', true)
		.addField('``info``', 'short: ``if``\nusage: ``info``\ndesc: report current channel info', true);

	// if not in a voice channel, print help
	if (!msg.member.voiceState.channelID) {
		return msg.reply({
			embed: _help,
		});
	}

	// get required variables
	const voice = msg.guild().channels.get(msg.member.voiceState.channelID);
	const owner = opt.mod.getDatastore().get(voice.id);
	const everyone = msg.guild().getRole('@everyone');

	// if voice doesn't exist? or is a stage channel
	if (!voice || voice.type !== 2) {
		return msg.reply('Not in a voice channel (Stage channels not included)');
	}

	// if voice channel isn't self-generated by this bot
	if (!owner) {
		return msg.reply('Not an auto-generated voice channel');
	}

	// if owner of this channel is different
	if (owner !== msg.member.id) {
		return msg.reply('Not your channel');
	}

	// parse command
	switch (opt.args.shift()) {
		// ==================== Rename channel ====================
		case 'rename':
		case 'name': {
			if (opt.args.length === 0)
				return msg.reply(`Usage: ${opt.mod.bot.prefix}${opt.command} rename Some Cool Name Here`);

			voice
				.edit({
					name: opt.args.join(' '),
				})
				.then(() => {
					return msg.reply(`Set channel name to **${opt.args.join(' ')}**`);
				})
				.catch((e) => {
					return msg.report(e, __filename);
				});
			break;
		}

		// ==================== Kick user ====================
		case 'kick':
		case 'kk': {
			if (opt.args.length === 0)
				return msg.reply(`Usage: ${opt.mod.bot.prefix}${opt.command} kick <tag a user here/their ID>`);

			const member: Eris.Member = msg.guild().getUser(opt.args.join(''));

			if (!member) {
				return msg.reply(`Cound't find any member with by **${opt.args.join('')}**`);
			} else if (voice.voiceMembers.has(member.id)) {
				try {
					await member.edit({ channelID: null });
					return msg.reply(`Kicked user **${member.tag()}**`);
				} catch (_) {
					return msg.reply(`Unable to kick user **${member.tag()}**`);
				}
			} else {
				return msg.reply(`User **${member.tag()}** doesn't appear to be in your channel`);
			}
		}

		// ==================== Control bitrate ====================
		case 'bitrate':
		case 'br': {
			let br = Number(opt.args[0]);
			const max = msg.guild().maxBitrate();

			if (!opt.args[0]) return msg.reply(`Usage: ${opt.mod.bot.prefix}${opt.command} bitrate <number>`);
			if (Number.isNaN(br)) return msg.reply(`Invalid bitrate **${opt.args[0]}**`);

			if (br < 8) br = 64;
			if (br > max) br = max;

			voice
				.edit({ bitrate: br * 1000 })
				.then(() => {
					return msg.reply(`Set channel bitrate to **${br}**`);
				})
				.catch((e) => {
					return msg.report(e, __filename);
				});
			break;
		}

		// ==================== (Un)Lock channel ====================
		case 'lock':
		case 'lk': {
			const has = voice.hasPermission(everyone, 'voiceConnect');

			voice
				.editPermissions(everyone, [
					{
						name: 'voiceConnect',
						set: has ? 'deny' : 'default',
					},
				])
				.then(() => {
					return msg.reply(`${has ? 'Locked' : 'Unlocked'} voice channel`);
				})
				.catch((e) => {
					return msg.report(e, __filename);
				});
			break;
		}

		// ==================== Set private ====================
		case 'incognito':
		case 'in': {
			const has = voice.hasPermission(everyone, 'viewChannel');

			voice
				.editPermissions(everyone, [
					{
						name: 'viewChannel',
						set: has ? 'deny' : 'default',
					},
				])
				.then(() => {
					return msg.reply(`${has ? 'Entered' : 'Exited'} incognito mode`);
				})
				.catch((e) => {
					return msg.report(e, __filename);
				});
			break;
		}

		// ==================== User limit ====================
		case 'limit':
		case 'lm': {
			const limit = Number(opt.args.shift());

			voice
				.edit({
					userLimit: Number.isNaN(limit) || limit < 0 || limit > 99 ? 0 : limit,
				})
				.then(() => {
					return msg.reply(
						`Set voice channel limit to **${
							Number.isNaN(limit) || limit < 0 || limit > 99 ? 'Unlimited' : limit
						}**`,
					);
				})
				.catch((e) => {
					return msg.report(e, __filename);
				});
			break;
		}

		// ==================== Channel info ====================
		case 'info':
		case 'if': {
			const val = {
				isLocked: voice.hasPermission(everyone, 'voiceConnect'),
				isHidden: voice.hasPermission(everyone, 'viewChannel'),
				owner: voice.guild.getUser(opt.mod.getDatastore().get(voice.id)),
				bitrate: voice.bitrate,
				limit: voice.userLimit,
				name: voice.name,
			};

			return msg.reply({
				embed: new Eris.Embed().setColor(opt.mod.bot.color).setTitle('Room configuration').setDescription(`
								Name? - ${val.name}
                                Owner? - ${val.owner.tag()}
								Limit? - ${val.limit} members
								Bitrate? - ${Math.round(val.bitrate / 1e3)}
								Is locked? - ${!val.isLocked}
								Is hidden? - ${!val.isHidden}
							`),
			});
		}

		// ==================== Switch owner ====================
		case 'switch':
		case 'sw': {
			if (opt.args.length === 0)
				return msg.reply(`Usage: ${opt.mod.bot.prefix}${opt.command} switch <tag a user here/their ID>`);

			const member: Eris.Member = msg.guild().getUser(opt.args.join(''));

			if (!member) {
				return msg.reply(`Cound't find any member with by **${opt.args.join('')}**`);
			} else if (voice.voiceMembers.has(member.id)) {
				opt.mod.getDatastore().set({
					key: voice.id,
					value: member.id,
				});
				return msg.reply(`Changed channel's owner to **${member.tag()}**`);
			} else {
				return msg.reply(`User **${member.tag()}** doesn't appear to be in your channel`);
			}
		}

		// ==================== Help ====================
		default: {
			return msg.reply({
				embed: _help,
			});
		}
	}
}
