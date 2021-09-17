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
			name: "chatbot",
			description: "Chat with a bot",
			args: [
				{
					name: "text",
					type: ArgumentType.STRING,
					description: "Text",
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
			.request(
				`/api/tools/chatbot?message=${encodeURIComponent(
					objectArgs.text
				)}&user=${encodeURIComponent(
					author.username
				)}&botname=${encodeURIComponent(client.user.username)}`,
				"GET"
			)
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
			.setTitle(`Chatbot`)
			.setDescription(data.reply)
			.setColor("RANDOM")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp();

		respond({
			embeds: [embed],
			ephemeral: false,
		});
	}
};
