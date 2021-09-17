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
			name: "help",
			description: "Check bot's commands",
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
		const embed = new Discord.MessageEmbed()
			.setTitle("Help menu")
			.setDescription(
				`:robot: This bot is powered by [AnonDev API](https://api.anondev.ml).\n\n**Commands:** W.I.P\n`
			)
			.setColor("#3f6fa1")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp()
			.setThumbnail(client.user.avatarURL());

		let button1 = new MessageButton()
			.setLabel("API Link")
			.setEmoji("⚙️")
			.setURL(`https://api.anondev.ml`);

		respond({
			embeds: [embed],
			ephemeral: false,
			components: [new MessageActionRow().addComponents([button1])],
		});
	}
};
