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
			name: "ping",
			description: "Checks the bot's latency",
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
		let ping =
			Date.now() - (interaction ? interaction.createdAt : message.createdAt);
		respond({
			content: `**My Ping:** **\`${ping}ms\`**\n**WS Ping:** **\`${client.ws.ping}ms\`**`,
			ephemeral: true,
		});
	}
};
