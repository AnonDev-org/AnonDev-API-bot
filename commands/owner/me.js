const {
	Command,
	MessageActionRow,
	MessageButton,
	ArgumentType,
} = require("gcommands");
const Discord = require("discord.js");
const moment = require("moment");
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "me",
			description: "Get info about your API key",
			category: "owner",
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
		if (!client.config.owner)
			return respond({ content: ":x: No bot owner is set", ephemeral: true });
		if (author.id !== client.config.owner)
			return respond({ content: ":x: You can't use this", ephemeral: true });

		const resp = await client.request(`/api/others/me`, "GET").catch((err) => {
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

		let created_at = `<t:${moment(data.created_at).format("X")}:f>`;
		let regenerated_at = `<t:${moment(data.regenerated_at).format("X")}:f>`;

		const embed = new Discord.MessageEmbed()
			.setTitle(`Info about your API key`)
			.addField("User", `${data.user_tag} (${data.user_id})`)
			.addField("Tier", `${data.tier}`, true)
			.addField("Rate limit", `${data.rate_limit}`, true)
			.addField("Rate limit Remaining", `${data.rate_limit_remaining}`, true)
			.addField("Calls", `${data.calls}`, true)
			.addField(
				"Created at",
				`${created_at !== "Invalid date" ? `${created_at}` : "?"}`,
				true
			)
			.addField(
				"Regenerated at",
				`${
					regenerated_at !== "Invalid date"
						? `${regenerated_at}`
						: "not regenerated"
				}`,
				true
			)
			.setColor("#3f6fa1")
			.setFooter(client.user.username, client.user.avatarURL())
			.setTimestamp();
		let button1 = new MessageButton()
			.setLabel("API Link")
			.setEmoji("⚙️")
			.setURL(`https://api.anondev.ml`);
		let button2 = new MessageButton()
			.setLabel("API Docs")
			.setEmoji("📓")
			.setURL(`https://docs.api.anondev.ml`);

		respond({
			embeds: [embed],
			ephemeral: true,
			components: [new MessageActionRow().addComponents([button1, button2])],
		});
	}
};
