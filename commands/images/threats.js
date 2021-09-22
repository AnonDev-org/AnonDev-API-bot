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
			name: "threats",
			description: "Generate threats image",
			category: "images",
			args: [
				{
					name: "user",
					type: ArgumentType.USER,
					description: "User",
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
		let user = (await objectArgs.user)
			? client.users.cache.get(objectArgs.user.replace(/[\\<>@#&!]/g, ""))
			: author;
		await respond({ content: ":gear: Generating image ..." });
		const resp = await client
			.request(
				`/api/images/threats?image=${encodeURIComponent(user.avatarURL())}`,
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
			.setTitle(`Threats`)
			.setImage(data.url)
			.setColor("RANDOM")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp();

		edit({
			content: null,
			embeds: [embed],
			ephemeral: false,
		});
	}
};
