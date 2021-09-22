module.exports = async (client) => {
	const Discord = require("discord.js");
	async function automeme() {
		// let guilds = await client.guilds.fetch()
		await client.guilds.cache.forEach(async (guild) => {
			let automeme_channel = await client.db.get(`automeme_${guild.id}`);
			if (!automeme_channel) return;
			let channel = await guild.channels
				.fetch(String(automeme_channel))
				.catch(console.error);
			if (!channel) return;
			const resp = await client
				.request(
					`/api/images/meme${
						client.config.automemeSubreddit
							? `?subreddit=${client.config.automemeSubreddit}`
							: ""
					}`,
					"GET"
				)
				.catch((err) => {
					console.log("Error while fetching API endpoint", err);
					return channel.send(
						`**[Auto Meme]** :x: Error while fetching API endpoint \`${err.message}\``
					);
				});
			let data = await resp.json();
			if (!resp.ok) {
				console.log(
					`API returned error ${resp.status} ${resp.statusText}`,
					data
				);
				return channel.send(
					`**[Auto Meme]** :x: API returned error \`${resp.status} ${
						resp.statusText
					}\`\n\n> \`${JSON.stringify(data)}\``
				);
			}

			const embed = new Discord.MessageEmbed()
				.setTitle(`${data.title} from /r/${data.subreddit}`)
				.setURL(data.link)
				.setImage(data.url)
				.setColor("RANDOM")
				.setFooter(client.user.username, client.user.avatarURL())
				.setTimestamp();

			channel.send({ content: "Auto Meme", embeds: [embed] });
		});
	}

	setInterval(automeme, client.config.automemeInterval);

	setTimeout(automeme, 10000); // execute function 10s after bot started
};
