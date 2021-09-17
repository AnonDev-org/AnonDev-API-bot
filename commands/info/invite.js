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
			name: "invite",
			description: "Get bot's invite link",
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
		respond({
			content: `:link: You can invite by by clicking on [this](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=448891579457&scope=bot%20applications.commands) link.`,
			ephemeral: true,
		});
	}
};
