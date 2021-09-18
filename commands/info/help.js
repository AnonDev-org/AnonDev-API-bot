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
				`:robot: This bot is powered by [AnonDev API](https://api.anondev.ml). You can find the source code on [GitHub](https://github.com/AnonDev-org/AnonDev-API-bot)\n\n**Commands:**\n`
			)
			.setColor("#3f6fa1")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp()
			.setThumbnail(client.user.avatarURL());

		client.gcommands.forEach((cmd) => {
			embed.addField(
				`**${client.config.prefix}${cmd.name} ${
					cmd.aliases && cmd.aliases.length > 1 ? `(${cmd.aliases})` : ""
				}**`,
				`${cmd.description}`,
				true
			);
		});

		let button1 = new MessageButton()
			.setLabel("API Link")
			.setEmoji("⚙️")
			.setURL(`https://api.anondev.ml`);
		let button2 = new MessageButton()
			.setLabel("Repo Link")
			.setEmoji("🇬")
			.setURL(`https://github.com/AnonDev-org/AnonDev-API-bot`);

		respond({
			embeds: [embed],
			ephemeral: false,
			components: [new MessageActionRow().addComponents([button1, button2])],
		});
	}
};
