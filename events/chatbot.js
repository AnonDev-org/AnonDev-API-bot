const { Event } = require("gcommands");

module.exports = class Chatbot extends Event {
  constructor(client) {
    super(client, {
      name: "message",
      once: false,
      ws: false,
    });
  }

  async run(client, message) {
    if (message.author.bot) return;
    let channel = await client.db.get(`chatbot_${message.guild.id}`);
    if (!channel) return;
    if (message.channel.id == channel) {
      message.content = message.content.replace(/@(everyone)/gi, "everyone").replace(/@(here)/gi, "here");
      await message.channel.sendTyping();
      if (!message.content) return message.reply({ content: "**:x: Please say something**" })

      const resp = await client
        .request(
          `/api/tools/chatbot?message=${encodeURIComponent(
            message.content
          )}&user=${encodeURIComponent(
            message.author.username
          )}&botname=${encodeURIComponent(client.user.username)}`,
          "GET"
        )
        .catch((err) => {
          console.log("Error while fetching API endpoint", err);
          return message.reply({
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
        return message.reply({
          content: `:x: API returned error \`${resp.status} ${
            resp.statusText
            }\`\n\n> \`${JSON.stringify(data)}\``,
          ephemeral: true,
        });
      }

      message.reply({
        content: data.reply, allowed_mentions: {
          "users": [client.user.id]
        }
      })

    }
  }
};
