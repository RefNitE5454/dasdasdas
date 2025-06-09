const Discord = require("discord.js");
const { EmbedBuilder,MessageEmbed } = require("discord.js")
const fs = require("fs");
const db = require('croxydb')
const config = require("./config.json");
const functions = require('./function/functions');
const Rest = require("@discordjs/rest");
const DiscordApi = require("discord-api-types/v10");

const client = new Discord.Client({
	intents:  3276543,
    partials: Object.values(Discord.Partials),
	allowedMentions: {
		parse: ["users", "roles", "everyone"]
	},
	retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

//
console.log(`[-] ${fs.readdirSync("./commands").length} komut algılandı.`)

for(let commandName of fs.readdirSync("./commands")) {
	if(!commandName.endsWith(".js")) return;

	const command = require(`./commands/${commandName}`);	
	client.commands.push({
		name: command.name.toLowerCase(),
		description: command.description.toLowerCase(),
		options: command.options,
		dm_permission: false,
		type: 1
	});

	console.log(`[+] ${commandName} komutu başarıyla yüklendi.`)
}

client.on('messageCreate', msg => { 
	
	if (msg.content === `<@${config["bot-id"]}>`) {
        msg.reply('Birisi Beni Çağırdı Sanırım Komutlarıma `/yardım` ile bakabilirsin  💕');
    }
	
  });
  client.on('messageCreate', msg => {
    const content = msg.content.toLowerCase(); 

    const replies = {
        'sa': 'as cnm la naber 😋',
        'naber': 'iyi senden naber 😃',
        'sea': 'as cnm la naber 😋',
        'selam': 'as cnm la naber 😋',
        'selamun aleyküm': 'as cnm la naber 😋',
        'selamunaleyküm': 'as cnm la naber 😋',
        'selamunaleykum': 'as cnm la naber 😋'
    };
		if (replies[content]) {
			msg.reply(replies[content]);
		}
	});
// 

console.log(`[-] ${fs.readdirSync("./events").length} olay algılandı.`)

for(let eventName of fs.readdirSync("./events")) {
	if(!eventName.endsWith(".js")) return;

	const event = require(`./events/${eventName}`);	
	const evenet_name = eventName.split(".")[0];

	client.on(event.name, (...args) => {
		event.run(client, ...args)
	});

	console.log(`[+] ${eventName} olayı başarıyla yüklendi.`)
}



client.once("ready", async() => {
	const rest = new Rest.REST({ version: "10" }).setToken(config.token);
  try {
    await rest.put(DiscordApi.Routes.applicationCommands(client.user.id), {
      body: client.commands,  //
    });
	
	console.log(`${client.user.tag} Aktif! 💕`);
	db.set("botAcilis_", Date.now());

  } catch (error) {
    throw error;
  }
});

client.login(config.token).then(() => {
	console.log(`[-] Discord API'ye istek gönderiliyor.`);
	eval("console.clear()")
}).catch(() => {
	console.log(`[x] Discord API'ye istek gönderimi başarısız(token girmeyi unutmuşsun).`);
});    

client.on("ready", () => {
  const channel = client.channels.get("1381543154687152178");
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    // Yay, it worked!
    console.log("Successfully connected.");
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
});