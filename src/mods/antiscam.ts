import { Intents, Message } from "discord.js";
import { SucklessBot } from "../core/sucklessbot";

export = {
	name: "AntiScam",
	author: "acayrin",
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	command: [],
<<<<<<< HEAD
	description: "Remove all* messages that are possibly scam",
	usage: "none",
	onMsgCreate: (msg: Message, args: string[], bot: SucklessBot): void => {
		if (msg.embeds?.length > 0) {
			const title = msg.embeds?.at(0).title;
			if (title?.match(/free/gi) && title?.match(/nitro/gi)) {
=======
	aliases: [],
	description: "Remove all* messages that are possibly scam",
	usage: "none",
	onMsgCreate: (msg: Message, args: string[], bot: SucklessBot): void => {
		if (msg.embeds.length > 0) {
			const title = msg.embeds.at(0).title;
			if (title.match(/free/gi) && title.match(/nitro/gi)) {
>>>>>>> f9c723bebb408525ffaf8ba2e9de1624ce54dcab
				msg.delete();
			}
		}
	},
};