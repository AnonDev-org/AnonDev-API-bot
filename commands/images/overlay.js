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
			name: "overlay",
			description: "Create overlay for the image",
			category: "images",
			args: [
				{
					name: "type",
					type: ArgumentType.STRING,
					description: "Type of overlay you want to get",
					required: true,
					choices: [
						{ name: "Gay", value: "gay" },
						{ name: "Glass", value: "glass" },
						{ name: "Wasted", value: "wasted" },
						{ name: "Passed", value: "passed" },
						{ name: "Jail", value: "jail" },
						{ name: "Comrade", value: "comrade" },
						{ name: "Triggered", value: "triggered" },
						{ name: "Blur", value: "blur" },
						{ name: "Pixelate", value: "pixelate" },
						{ name: "Horny", value: "horny" },
						{ name: "Blurple", value: "blurple" },
						{ name: "Blurple2", value: "blurple2" },
					],
				},
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
		let type = client.helpers.isObject(objectArgs.type)
			? objectArgs.type.value
			: objectArgs.type;

		const resp = await client
			.request(
				`/api/images/overlay/${type}?image=${encodeURIComponent(
					user.avatarURL()
				)}`,
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
			.setTitle(`${user.username}'s ${client.helpers.capitalize(type)} avatar`)
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
