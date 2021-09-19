require("./keep_alive.js"); // webserver
require("dotenv").config();
const config = require("./config.js");
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const { GCommandsClient } = require("gcommands");
const { join } = require("path");
const fetch = require("node-fetch");
const { request } = require("./helpers.js");
let db = null;
if (process.env.REPLIT_DB_URL) {
	// use replit database if it's hosted on replit
	const { Database } = require("quick.replit");
	db = new Database(process.env.REPLIT_DB_URL);
} else {
	db = require("quick.db");
}

const client = new GCommandsClient({
	cmdDir: join(__dirname, "commands"),
	eventDir: join(__dirname, "events"),
	language: "english",
	commands: {
		slash: "both",
		context: "false",
		prefix: config.prefix,
	},
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
	],
	partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER"],
	autoTyping: config.autoTyping || false,
});
client.config = config;
client.request = request;
client.helpers = require("./helpers.js");
client.db = db;

if (!config.token) {
	console.error("TOKEN is missing in .env file");
	process.exit();
}
if (!config.apiKey) {
	console.error("API_KEY is missing in .env file");
	process.exit();
}

client.on("ready", async () => {
	console.log(`${client.user.tag} (AnonDev API Bot has started) has started!`);
	client.user.setPresence({
		activities: [
			{ name: "Powered by api.anondev.ml", type: "WATCHING" },
			{
				name: `Use ${config.prefix}help or type / to discover slash commands`,
				type: "PLAYING",
			},
		],
		status: "online",
	});

	if (!config.owner) {
		// automatically fill owner in config
		await client.application.fetch();
		config.owner = client.application.owner
			? client.application.owner.id
			: null;
	}
});

client.on("log", console.log);
client.on("error", console.error);

if (config.debug) {
	client.on("debug", console.log);
	client.on("rateLimit", console.log);
	client.on("warn", console.warn);
}

client.login(config.token);

process.on("uncaughtException", (err) => {
	console.error("There was an uncaught error", err);
	if (config.exitOnCrash) {
		process.exit(1);
	}
});
