module.exports = {
	token: process.env.TOKEN,
	apiKey: process.env.API_KEY,
	prefix: "!",
	port: process.env.PORT || 3000,
	autoTyping: true,
	categories: ["info", "images", "other", "tools", "settings", "owner"],
	debug: false,
	exitOnCrash: false,
	automemeInterval: 900000, // 15 mins (in miliseconds)
};
