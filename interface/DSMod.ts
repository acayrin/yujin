import { Client, Intents, Message, PartialMessage } from "discord.js";
import { Bot } from "../bot";

/**
 * Discord bot Mod(dule) interface
 *
 * @export
 * @interface DSMod
 */
interface DSMod {
	/**
	 * A mod name
	 *
	 * @type {string}
	 * @memberof DSMod
	 */
	name: string,
	/**
	 * Mod's author (if any)
	 *
	 * @type {string}
	 * @memberof DSMod
	 */
	author?: string,
	/**
	 * Mod's required Discord intents
	 *
	 * @type {Intents[]}
	 * @memberof DSMod
	 */
	intents: Intents[],
	/**
	 * Mod's base command
	 *
	 * @type {string}
	 * @memberof DSMod
	 */
	command: string | string[],
	/**
	 * Mod's command aliases (if any)
	 *
	 * @type {string[]}
	 * @memberof DSMod
	 */
	aliases?: string | string[],
	/**
	 * Mod's description (if any)
	 *
	 * @type {string}
	 * @memberof DSMod
	 */
	description?: string,
	/**
	 * Mod's usage, shown when missing input (if any)
	 *
	 * @type {string}
	 * @memberof DSMod
	 */
	usage?: string,
	/**
	 * Mod's callback function for setup
	 *
	 * @memberof DSMod
	 */
	onInit?: (bot: Bot) => void
	/**
	 * Mod's callback function for messageCreate event
	 *
	 * @memberof DSMod
	 */
	onMsgCreate?: (msg: Message | PartialMessage, arg: string[], bot: Bot) => void
	/**
	 * Mod's callback function for messageDelete event
	 *
	 * @memberof DSMod
	 */
	onMsgDelete?: (msg: Message | PartialMessage, arg: string[], bot: Bot) => void
	/**
	 * Mod's callback function for messageUpdate event
	 *
	 * @memberof DSMod
	 */
	onMsgUpdate?: (oldMsg: Message | PartialMessage, newMsg: Message | PartialMessage, bot: Bot) => void
}

export { DSMod }