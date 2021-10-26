/* 
If you are hosting this bot on services like replit, add link to the webserver to https://uptimer.pinglik.eu to keep it online for free!
*/
const config = require("./config.js");
const express = require("express");
const app = express();
const port = config.port || 3000;

app.get("/", (req, res) => {
	res.send(
		"<code>Hello, this project is using <a href='https://uptimer.pinglik.eu' target='_blank'>Pinglik Uptimer</a>!<br>Our website: <a href='https://pinglik.eu' target='_blank'>pinglik.eu</a><br><br>This project is a Discord bot powered by <a href='https://api.anondev.ml' target='_blank'>AnonDev API</a><br>You can find source code <a href='https://github.com/AnonDev-org/AnonDev-API-bot' target='_blank'>here</a>. </code>"
	);
});

app.listen(port, () => {
	console.log(`📡 Pinglik webserver is listening on port ${port}!`);
});
