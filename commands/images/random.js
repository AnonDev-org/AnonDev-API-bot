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
			name: "random",
			category: "images",
			description: "Get image of that does not exist (generated using GAN)",
			args: [
				{
					name: "person",
					description:
						"Get image of person that does not exist (generated using GAN)",
					type: ArgumentType.SUB_COMMAND,
					options: [],
				},
				{
					name: "cat",
					description:
						"Get image of cat that does not exist (generated using GAN)",
					type: ArgumentType.SUB_COMMAND,
					options: [],
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
		if (objectArgs.person) {
			const resp = await client
				.request(`/api/images/randomperson`, "GET")
				.catch((err) => {
					console.log("Error while fetching API endpoint", err);
					return respond({
						content: `:x: Error while fetching API endpoint \`${err.message}\``,
						ephemeral: true,
					});
				});
			await respond({ content: ":gear: Generating image ..." });
			let data = await resp.json();
			if (!resp.ok) {
				console.log(
					`API returned error ${resp.status} ${resp.statusText}`,
					data
				);
				return respond({
					content: `:x: API returned error \`${resp.status} ${
						resp.statusText
					}\`\n\n> \`${JSON.stringify(data)}\``,
					ephemeral: true,
				});
			}

			const embed = new Discord.MessageEmbed()
				.setTitle(`Person that does not exist`)
				.setImage(data.url)
				.setColor("RANDOM")
				.setFooter(client.user.username, client.user.avatarURL())
				.setTimestamp();

			respond({
				embeds: [embed],
				ephemeral: false,
			});
		}
		if (objectArgs.cat) {
			const resp = await client
				.request(`/api/images/randomcat`, "GET")
				.catch((err) => {
					console.log("Error while fetching API endpoint", err);
					return respond({
						content: `:x: Error while fetching API endpoint \`${err.message}\``,
						ephemeral: true,
					});
				});
			let data = await resp.json();
			if (!resp.ok) {
				console.log(
					`API returned error ${resp.status} ${resp.statusText}`,
					data
				);
				return respond({
					content: `:x: API returned error \`${resp.status} ${
						resp.statusText
					}\`\n\n> \`${JSON.stringify(data)}\``,
					ephemeral: true,
				});
			}

			const embed = new Discord.MessageEmbed()
				.setTitle(`Cat that does not exist`)
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
	}
};
