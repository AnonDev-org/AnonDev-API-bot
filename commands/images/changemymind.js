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
			name: "changemymind",
			description: "Generate change my mind meme",
			category: "images",
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
		await respond({ content: ":gear: Generating image ..." });
		const resp = await client
			.request(
				`/api/images/changemymind?text=${encodeURIComponent(objectArgs.text)}`,
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
			.setTitle(`Change My Mind`)
			.setImage(data.url)
			.setColor("RANDOM")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp();

		edit({
			content: undefined,
			embeds: [embed],
			ephemeral: false,
		});
	}
};
