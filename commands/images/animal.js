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
			name: "animal",
			description: "Get random animal",
			category: "images",
			args: [
				{
					name: "animal",
					type: ArgumentType.STRING,
					description: "Animal to get image of",
					category: "images",
					required: true,
					choices: [
						{ name: "Cat", value: "cat" },
						{ name: "Dog", value: "dog" },
						{ name: "Fox", value: "fox" },
						{ name: "Panda", value: "panda" },
						{ name: "Red Panda", value: "red_panda" },
						{ name: "Bird", value: "bird" },
						{ name: "Koala", value: "koala" },
						{ name: "Raccoon", value: "raccoon" },
						{ name: "Kangaroo", value: "kangaroo" },
						{ name: "Shiba", value: "shiba" },
						{ name: "Lizard", value: "lizard" },
					],
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
		let value = client.helpers.isObject(objectArgs.animal)
			? objectArgs.animal.value
			: objectArgs.animal;

		const resp = await client
			.request(`/api/images/${value}`, "GET")
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
			.setTitle(`${client.helpers.capitalize(value)}`)
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
