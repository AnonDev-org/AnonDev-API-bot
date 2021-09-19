const fetch = require("node-fetch");
const config = require("./config.js");
const formdata = require("form-data");
const moment = require("moment");

/**
 * Send a request to the specified AnonDev API endpoint
 * @param {String} endpoint The resource being requested
 * @param {String} method The method of the request
 * @param {JSON} bodyJSON The body of the request
 * @returns {Promise<Object<string, any>>}
 */

async function request(
	endpoint,
	method = "GET",
	bodyJSON = {},
	bodyType = "formdata"
) {
	const apiURL = config.apiURL ? config.apiURL : "https://api.anondev.ml";
	const apiKey = config.apiKey;

	if (bodyType == "formdata") {
		var body = new formdata();
		for await (const [name, value] of Object.entries(bodyJSON)) {
			body.append(name, value);
		}
	} else if (bodyType == "urlencoded") {
		const formBody = [];
		for (const property in bodyJSON) {
			const encodedKey = encodeURIComponent(property);
			const encodedValue = encodeURIComponent(bodyJSON[property]);
			formBody.push(`${encodedKey}=${encodedValue}`);
		}
		var body = formBody.join("&");
	}
	return await fetch(`${apiURL}${endpoint}`, {
		method,
		body: ["GET", "HEAD"].includes(method) ? null : body,
		headers: {
			Authorization: `${apiKey}`,
			Accept: "application/json",
			"User-Agent": `AnonDev_API_Bot_Request@v${
				require("./package.json").version
			}`,
		},
	});
}
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function formatDate(date, divide) {
	if (divide) {
		let formatted = `<t:${moment(date / 1000).format("x")}:f>`;
		if (formatted.includes("Invalid date")) return "Invalid date";
		return formatted;
	} else {
		let formatted = `<t:${moment(date).format("x")}:f>`;
		if (formatted.includes("Invalid date")) return "Invalid date";
		return formatted;
	}
}

module.exports = {
	request,
	capitalize,
	formatDate,
};
