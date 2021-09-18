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
			name: "ipinfo",
			description: "Get info about specific IP address",
			args: [
				{
					name: "ip",
					type: ArgumentType.STRING,
					description: "IP address",
					required: true,
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
		const resp = await client
			.request(`/api/others/ip?ip=${objectArgs.ip}`, "GET")
			.catch((err) => {
				console.log("Error while fetching API endpoint", err);
				return respond({
					content: `:x: Error while fetching API endpoint \`${err.message}\``,
					ephemeral: true,
				});
			});
		let data = await resp.json();
		if (!resp.ok) {
			console.log(`API returned error ${resp.status} ${resp.statusText}`, data);
			return respond({
				content: `:x: API returned error \`${resp.status} ${
					resp.statusText
				}\`\n\n> \`${JSON.stringify(data)}\``,
				ephemeral: true,
			});
		}
		const embed = new Discord.MessageEmbed()
			.setTitle(`IP info`)
			.addField("IP", data.ip, true)
			.addField("Hostname", data.hostname, true)
			.addField(
				"Location",
				`${data.city}, ${data.region} (${data.country})`,
				true
			)
			.addField("Timezone", `${data.timezone}`, true)
			.addField("Organization", `${data.org}`, true)
			.setColor("RANDOM")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp();

		respond({
			embeds: [embed],
			ephemeral: false,
		});
	}
};
