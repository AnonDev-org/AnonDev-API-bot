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
			name: "serverinfo",
			description: "Display information about the current server",
			category: "others",
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
		if (!guild)
			return respond({
				content: `Looks like you didn't send this message from a server`,
				ephemeral: true,
			});
		await guild.fetch();
		let owner = await guild.fetchOwner();

		let veriflevel = {
			NONE: "None",
			LOW: "Low",
			MEDIUM: "Medium",
			HIGH: "High - (╯°□°）╯︵  ┻━┻",
			VERY_HIGH: "Highest - ┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻",
		};

		let region = {
			brazil: ":flag_br: Brazil",
			"eu-central": ":flag_eu: Central Europe",
			europe: ":flag_eu: Europe",
			singapore: ":flag_sg: Singapore",
			"us-central": ":flag_us: U.S. Central",
			sydney: ":flag_au: Sydney",
			"us-east": ":flag_us: U.S. East",
			"us-south": ":flag_us: U.S. South",
			"us-west": ":flag_us: U.S. West",
			"eu-west": ":flag_eu: Western Europe",
			"vip-us-east": ":flag_us: VIP U.S. East",
			london: ":flag_gb: London",
			amsterdam: ":flag_nl: Amsterdam",
			hongkong: ":flag_hk: Hong Kong",
			russia: ":flag_ru: Russia",
			southafrica: ":flag_za:  South Africa",
			japan: ":flag_jp: Japan",
			india: ":flag_in: India",
		};
		const roles = guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);
		let rolesdisplay;
		if (roles.length < 20) {
			rolesdisplay = roles.join(" ");
		} else {
			rolesdisplay = roles.slice(20).join(" ");
		}

		const embed = new Discord.MessageEmbed()
			.setThumbnail(guild.iconURL({ format: "gif" }))
			.setTitle(`Server info`)
			.addField("Name", guild.name, true)
			.addField("ID", guild.id, true)
			.setThumbnail(guild.iconURL())
			.addField("Owner", `${owner.user.tag} (${owner.user.id})`, true)
			//  .addField("Server Boost Count",guild.premiumSubscriptionCount || "0",true)
			.addField("Boost Level", `${guild.premiumSubscriptionCount || "0"}`, true)
			.addField(
				"Boost Tier",
				`${guild.premiumTier ? `Tier ${guild.premiumTier}` : "None"}`,
				true
			)
			.addField("Verification Level", veriflevel[guild.verificationLevel], true)
			.addField("Region", guild.region ? guild.region : "?", true)
			.addField(
				"Created at",
				client.helpers.formatDate(guild.createdAt, true),
				true
			)
			.addField(
				"Counts",
				`Total Users: **${guild.members.cache.size}**\nMembers: **${
					guild.members.cache.filter((member) => !member.user.bot).size
				}**\nBots: **${
					guild.members.cache.filter((member) => member.user.bot).size
				}**\nRoles: **${guild.roles.cache.size}** \nChannels: **${
					guild.channels.cache.size
				}**\nText Channels: **${
					guild.channels.cache.filter(
						(channel) => channel.type === "GUILD_TEXT"
					).size
				}**\nVoice Channels: **${
					guild.channels.cache.filter(
						(channel) => channel.type === "GUILD_VOICE"
					).size
				}**\nThreads: **${
					guild.channels.cache.filter(
						(channel) => channel.type === "GUILD_PUBLIC_THREAD"
					).size
				}**\nEmojis: **${guild.emojis.cache.size}**\nNormal Emojis: **${
					guild.emojis.cache.filter((emoji) => !emoji.animated).size
				}**\nAnimated Emojis: **${
					guild.emojis.cache.filter((emoji) => emoji.animated).size
				}**`,
				false
			);
		if (rolesdisplay)
			embed
				.addField(`Roles [${roles.length - 1}]`, rolesdisplay, false)

				.setColor("RANDOM")
				.setFooter(client.user.username, client.user.avatarURL())
				.setTimestamp();

		respond({
			embeds: [embed],
			ephemeral: false,
		});
	}
};
