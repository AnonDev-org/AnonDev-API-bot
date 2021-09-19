const {
	Command,
	MessageActionRow,
	MessageButton,
	ArgumentType,
} = require("gcommands");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "botstats",
			description: "Display information about the bot",
			category: "others",
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
		const duration = moment
			.duration(client.uptime)
			.format(" D [days], H [hours], m [minutes], s [seconds]");
		const embed = new Discord.MessageEmbed()
			.setTitle("**Bot Stats**")
			.addField(
				"📊 Statistics",
				`
            **Users »** ${client.users.cache.size}
            **Servers »** ${client.guilds.cache.size}
            **Channels »** ${client.channels.cache.size}
            **Emojis »** ${client.emojis.cache.size}
            **Uptime »** \`${duration}\`
            **System »**  \`${os.type()} - ${os.arch()} ${os.release()}\`
            **Bot Ping »**  \`${Math.round(client.ws.ping)} ms\``
			)
			.addField(
				"💡 Bot Module Versions",
				`
            **Discord.js »** \`v${Discord.version}\`
            **Node.js »** \`${process.version}\``
			)
			.addField(
				"🖥 Usage",
				`
            **Memory Usage »** ${(
							process.memoryUsage().rss /
							1024 /
							1024
						).toFixed(2)} MB
            **CPU Usage »** ${(process.cpuUsage().system / 1024 / 1024).toFixed(
							2
						)}%
            **Node CPU Usage »** ${(
							process.cpuUsage().user /
							1024 /
							1024
						).toFixed(2)}%`
			)
			.setColor("RANDOM")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp();

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
