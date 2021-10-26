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
      name: "animalfact",
      description: "Get random animal fact",
      category: "others",
      args: [
        {
          name: "animal",
          type: ArgumentType.STRING,
          description: "Animal to get fact of",
          category: "others",
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
    let value = client.helpers.isObject(objectArgs.animal)
      ? objectArgs.animal.value
      : objectArgs.animal;
    const resp = await client
      .request(`/api/others/fact/${value}`, "GET")
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
      .setTitle(`${client.helpers.capitalize(value)} Fact`)
      .setDescription(data.fact)
      .setColor("RANDOM")
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();

    respond({
      embeds: [embed],
      ephemeral: false,
    });
  }
};
