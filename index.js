const Discord = require("discord.js");
const bot = new Discord.Client();
let cron = require("node-cron");
require("dotenv").config();
const token = process.env.TOKEN;
const WOTV = process.env.WOTV_BACKEND;
const fetch = require("node-fetch");

const yes = [
	`Yes!`,
	`My daddy says yes!`,
	`According to my calculations, YES!`,
	`Absolutely!`,
	`Yes, I'm sure!`,
	`For sure!`,
	`Yup!`,
	`Yeah, it seems so.`,
	`Surprisingly, yes.`,
	`Obviously duh!`,
	`FUCK YEAH!`,
	`A million times, yes!`,
	`That is true. Now shut up.`,
	`A resounding yes!`,
	`Of course yes!`,
	`Of course! Do you even need to ask?`,
	`Duh! Everybody knows that!`
];
const no = [
	`No, I don't think so.`,
	`Oh man, why do you ask? But that's a NO from me.`,
	`Yikes! No way!`,
	`Sadly, no.`,
	`HELL NO!`,
	`Nope!`,
	`You thought I'd say yes, but it's a hard NO!`,
	`No way Jose!`,
	`Maybe. What's it to you?`,
	`Sorry but no.`,
	`Sorry I just ran out of fucks to give.`,
	`My calculation glasses tell me no.`,
	// `Dory keeps saying 'no' but I'm not sure if she's even talking to me.`,
	`Why don't you just roll a dice? My vote is no.`,
	`There’s a 100% chance that I’m going say no to that one.`
];

bot.on("ready", () => {
	console.log("System online. Ildyra at your service!");
});

const getRes = async (name) => {
	let url = `${WOTV}/characters/${name}`;
	let data = await fetch(url);
	let response = await data.json();
	console.log(response);
	if (response.status === "fail") return "No unit with that name found! Educate yourself, uncultured swine!";
	return response.data.resImgUrl;
};

const getStats = async (name) => {
	let url = `${WOTV}/characters/${name}`;
	let data = await fetch(url);
	let response = await data.json();
	console.log(response);
	if (response.status === "fail") return "No unit with that name found! Educate yourself, uncultured swine!";
	return response.data.statImgUrl;
};

const getInfo = async (name) => {
	let url = `${WOTV}/characters/${name}`;
	let data = await fetch(url);
	let response = await data.json();
	console.log(response);
	if (response.status === "fail") return "No unit with that name found! Educate yourself, uncultured swine!";
	return { stats: response.data.statImgUrl, res: response.data.resImgUrl };
};

const pickOne = (array) => {
	let choice = array[Math.floor(Math.random() * array.length)].replace(",", "").trim();
	return `'${choice.charAt(0).toUpperCase() + choice.slice(1)}'`;
};

bot.on("message", async (msg) => {
	let message = msg.content.replace(/\s+/g, " ").trim().toLowerCase();
	let words = message.split(" ");

	if (words[0] === "<@!795971666349523004>" || words[0] === "<@795971666349523004>") {
		// HELP && ABOUT
		if (words.length === 2) {
			if (words[1] === "help") {
				msg.channel.send(`Hi there!`);
				msg.channel.send(
					"You can get info about a character by tagging me and typing `info`, `res` or `stats` and the unit's name/nickname."
				);
				msg.channel.send("For example:");
				msg.channel.send("```@Math Girl res bling sterne```");
				msg.channel.send("You can also ask me a yes/no question, or ask me to choose one amongst a number of items.");
				return msg.channel.send(`
				\`\`\`
				@Math Girl will I get rich?
				@Math Girl pick one: save vis, rage summon
				\`\`\`
				`);
			}
		}

		if (words[1] === "about") {
			msg.channel.send(`Made by u/MuaLon on Reddit.`);
			return msg.channel.send(`https://www.reddit.com/r/wotv_ffbe/comments/krbkot/discord_bot_math_girl_resstats_info/`);
		}

		// UNIT RES/STATS/INFO
		if (words.length >= 3 && ["res", "stats", "info"].includes(words[1])) {
			let nickname = words.filter((e, i) => i > 1).join(" ");

			if (words[1] === "res") {
				const imgURL = await getRes(nickname);
				return msg.channel.send(imgURL);
			} else if (words[1] === "stats") {
				const imgURL = await getStats(nickname);
				return msg.channel.send(imgURL);
			} else {
				const imgObj = await getInfo(nickname);
				msg.channel.send(imgObj.stats);
				msg.channel.send(imgObj.res);
				return;
			}
		}

		// PICK ONE
		if (words[1] === "pick" && words[2] === "one:") {
			let choices = [];
			for (let i = 3; i < words.length; i++) {
				choices.push(words[i]);
			}
			choices = choices.join(" ").split(",");
			let choice = pickOne(choices);
			return msg.reply(`Per my calculations, ${choice} is the right choice.`);
		}

		// FUCK YOU
		if (words[1] === "fu" || (words[1] === "fuck" && words[2] === "you")) {
			return msg.reply(`Fuck you too, bitch!`);
		}

		// MADE BY PANDA
		if (message.includes("who") && message.includes("made") && message.includes("you")) {
			return msg.reply(`u/MuaLon made me. Who's your Daddy?`);
		}

		if (message.includes("who") && message.includes("your") && message.includes("daddy")) {
			return msg.reply(`<@!240277779415957504> made me. Who's YOUR daddy?`);
		}

		// SITE
		if (message.includes("site")) {
			return msg.reply(`https://wotv-guide.com`);
		}

		// EMOJIS
		if (message.includes("emojis")) {
			return msg.reply(`You can find our emojis at https://wotv-guide.com/miscellaneous`);
		}

		// I LOVE YOU
		if (message.includes("i love you") || message.includes("i wuv you")) {
			return msg.channel.send("I love me too! Now disappear from my sight!");
		}

		// YES/NO QUESTIONS
		if (
			words[1] === "is" ||
			words[1] === "are" ||
			words[1] === "will" ||
			words[1] === "do" ||
			words[1] === "does" ||
			words[1] === "did" ||
			words[1] === "am" ||
			words[1] === "can" ||
			words[1] === "could" ||
			words[1] === "may" ||
			words[1] === "might" ||
			words[1] === "would" ||
			words[1] === "shall" ||
			words[1] === "should" ||
			words[1] === "was" ||
			words[1] === "were" ||
			words[1] === "have" ||
			words[1] === "has" ||
			words[1] === "had" ||
			((words[1] === "how" || words[1] === "what") && words[2] === "about")
		) {
			let answer = Math.floor(Math.random() * 2) === 0 ? "yes" : "no";
			if (answer === "yes") {
				return msg.channel.send(yes[Math.floor(Math.random() * yes.length)]);
			} else {
				return msg.channel.send(no[Math.floor(Math.random() * no.length)]);
			}
		}
		return msg.reply("Please go back to school.");
	}
});

bot.login(token);

const http = require("http");
const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end("ok");
});
server.listen(3000);
