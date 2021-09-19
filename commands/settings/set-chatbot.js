const {
	Command,
	MessageActionRow,
	MessageButton,
	ArgumentType,
} = require("gcommands");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "set-chatbot",
			description: "Setup chatbot channel",
			userRequiredPermissions: "ADMINISTRATOR",
			category: "settings",
			args: [
				{
					name: "channel",
					type: ArgumentType.CHANNEL,
					description: "Channel where will chatbot reply to every message",
					required: false,
				},
			],
		});
	}
	async run({
		client,
		interaction,
		respond,
		guild,
		edit,
		member,
		author,
		args,
		objectArgs,
		message,
	}) {
		if (!objectArgs.channel) {
			await client.db.delete(`chatbot_${guild.id}`);
			return respond(`Successfully removed chatbot channel from database.`);
		}
		let channel = client.channels.cache.get(
			objectArgs.channel.replace(/<|>|!|#/g, "")
		);
		if (!channel) return respond(":x: Failed to the channel");
		await client.db.set(`chatbot_${guild.id}`, channel.id);
		respond(`Successfully changed chatbot channel to ${channel}.`);
	}
};
