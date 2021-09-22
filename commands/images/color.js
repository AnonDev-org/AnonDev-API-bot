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
			name: "color",
			description: "Create overlay for the image",
			category: "images",
			args: [
				{
					name: "color",
					type: ArgumentType.STRING,
					description: "Color you want to get preview of",
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
				`/api/images/color/?color=${encodeURIComponent(objectArgs.color)}`,
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
			.setTitle(`${data.color} preview`)
			.setImage(data.url)
			.setColor(`${data.color}`)
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp();

		edit({
			content: null,
			embeds: [embed],
			ephemeral: false,
		});
	}
};
