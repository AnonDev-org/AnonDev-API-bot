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
			name: "userinfo",
			description: "Display information about specific user",
			category: "others",
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
		let member2 = (await objectArgs.user)
			? guild.members.cache.get(objectArgs.user.replace(/[\\<>@#&!]/g, ""))
			: member;

		const joined = client.helpers.formatDate(member2.joinedAt, true);
		const created = client.helpers.formatDate(member2.user.createdAt, true);

		let status = {
			dnd: "🔴 **Do Not Distrub**",
			online: "🟢 **Online**",
			idle: "🟡 **Idle**",
			offline: "⚫ **Offline**",
		};
		let bot = {
			false: "👥 **User**",
			true: "🤖 **Bot**",
		};
		var embed = new Discord.MessageEmbed()
			.setTitle("User info")
			.setColor(
				member2.displayHexColor === "#000000"
					? "#ffffff"
					: member2.displayHexColor
			)
			.setThumbnail(member2.user.avatarURL())
			.addField("Name", member2.displayName, true)
			.addField("Tag", "#" + member2.user.discriminator, true)
			.addField("ID", member2.user.id, true)
			.addField("Type", bot[member2.user.bot], true)
			.addField("Joined on", joined, true)
			.addField("Created on", created, true)
			.addField(
				"Status",
				member2.presence ? status[member2.presence.status] : "⚫ **Offline**",
				true
			)
			.addField(
				"Presence",
				`${
					member2.presence &&
					member2.presence.activities &&
					member2.presence.activities.length > 0
						? `${
								member2.presence.activities[0].state ||
								member2.presence.activities[0].name
						  } (${member2.presence.activities[0].type})` || "None"
						: "None"
				}`,
				true
			);
		if (member2.roles.cache.size > 0)
			embed
				.addField(
					`Roles [${member2.roles.cache.size}]`,
					`${member2.roles.cache.map((r) => `${r}`).join(" ")}`
				)
				.setFooter(client.user.username, client.user.avatarURL());

		respond({
			embeds: [embed],
			ephemeral: false,
		});
	}
};
