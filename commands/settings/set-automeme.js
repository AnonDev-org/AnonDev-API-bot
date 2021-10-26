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
			name: "set-automeme",
			description: "Setup auto-meme channel",
			userRequiredPermissions: "ADMINISTRATOR",
			category: "settings",
			args: [
				{
					name: "channel",
					type: ArgumentType.CHANNEL,
					description:
						"Channel where memes will be automatically sent every x minutes",
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
			await client.db.delete(`automeme_${guild.id}`);
			return respond(`Successfully removed auto meme channel from database.`);
		}
		let channel = client.channels.cache.get(
			objectArgs.channel.replace(/<|>|!|#/g, "")
		);
		if (!channel) return respond(":x: Failed to the channel");
		if (
			!guild.me
				.permissionsIn(channel)
				.has(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"])
		)
			return respond(":x: I don't have required permissions in that channel");

		await client.db.set(`automeme_${guild.id}`, channel.id);
		respond(`Successfully changed auto meme channel to ${channel}.`);
	}
};
