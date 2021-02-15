const Discord = require("discord.js");
const fs = require('fs');
const { PREFIX , TOKEN} = JSON.parse(fs.readFileSync('./tools/config.json'));
const client = new Discord.Client();
client.login(TOKEN);
client.commandes = new Discord.Collection();
const commandFiles = fs.readdirSync('./commandes').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

let prefix = PREFIX

for (const file of commandFiles) {
	const commande = require(`./commandes/${file}`);
	client.commandes.set(commande.name, commande);
}

client.on('ready', () => {
    console.log("Bot connecté.")
    setInterval(() => {
        let data = JSON.parse(fs.readFileSync('./tools/statut.json')).messages
        data = data[getRandomInt(data.length)]
        client.user.setPresence(data)
    },10000)
})

client.on('ready', () => {
    const config = JSON.parse(fs.readFileSync('./tools/messages.json'))
    const links = JSON.parse(fs.readFileSync('./tools/link.json')); // recuperer les données
    var c = client.guilds.cache.get(links.swLink).channels.cache.get(links.aidechan);
    setInterval(() => {
        let messages = config.automessages
        let message = messages[getRandomInt(messages.length)]
        const AutoEmbed = new Discord.MessageEmbed()
            .setTitle(message.title)
            .setColor("RANDOM")
            .setDescription(message.content.name+"\n"+message.content.value)
            .setImage(message.image)
            .setFooter("Le support SurvivalWorld", "https://survivalworld.fr/img/uploads/theme_logo.png")
        c.send(AutoEmbed)
    }, 2160000);
})

client.on('message', (message) => { //envoi vers le salon aide si
    const data = JSON.parse(fs.readFileSync('./tools/config.json')); // récupérer les données
    const links = JSON.parse(fs.readFileSync('./tools/link.json')); // recuperer les données
    const list = JSON.parse(fs.readFileSync('./tools/list.json')); // recuperer les données
    if(message.author.bot || message.content.startsWith(data.PREFIX)) return; //filtre
    if(message.channel.id === links.aidechan || message.channel.parentID === links.pbAdmin) return;//si dans salon aide
    if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return; //filtre
    let i = 0
    const args = message.content.toLowerCase() //contenu du message tout en minuscule
    while(i <= list.aide.length) {
        if(args.includes(list.aide[i]) || message.mentions.users.first() === client.user) { //analyse si message contient mot précis
            const embed = new Discord.MessageEmbed()
                .setTitle("Besoin d'aide ?")
                .setColor("#5cb85c")
                .setDescription(`Tu as besoin d'aide ${message.author.username} ? Notre équipe support est prête à te répondre.\nRetrouve les [ici](https://discord.com/channels/${links.swLink}/${links.aidechan})`)
            return message.reply(embed)
        }
        i += 1
    }
})//END

client.on('message', message => {
    const data = JSON.parse(fs.readFileSync('./tools/config.json')); // récupérer les données
    const list = JSON.parse(fs.readFileSync('./tools/list.json')); // recuperer les données
    const links = JSON.parse(fs.readFileSync('./tools/link.json')); // recuperer les données
    if(message.author.bot || message.content.startsWith(data.PREFIX)) return; //filtre
    const content = message.content.trim().split(/ +/g);
    const args = message.content.toLowerCase() //contenu du message tout en minuscule
    let i = 0
    if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return; //filtre
    while(i <= list.blacklist.length) {
        if(args.includes(list.blacklist[i])) {
            let salon = message.guild.channels.cache.find(ch => ch.id === links.supportchan)
            const embed = new Discord.MessageEmbed()
                .setTitle(`Avertissement Langage - ${message.author.username}`)
                .setColor("#ff0000")
            .setDescription(`Joueur : ${message.author.tag} [${message.author.id}]\nSalon : [${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})\nContenu du message : [${message.content}](${message.url})`)
                .setTimestamp()
            return salon.send(embed)
        }
        i += 1
    }
})


client.on('message', message => { //commande Publique

	if(JSON.parse(fs.readFileSync('./tools/config.json')).maintenance) return message.channel.send('Erreur, le bot est en maintenance');

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commandes.get(commandName)
		|| client.commandes.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('Je ne peux pas executer cette commande dans des messages privés');
	}
	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('Vous n\'avez pas la permission d\'executer cette commande!');
		}
	}
	if (command.args && !args.length) {
		let reply = `Vous n'avez fourni aucun arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nLe bon usage est: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Veuillez patienter ${timeLeft.toFixed(1)} secondes avant de refaire la commande \`${command.name}\`.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {
		command.execute(message, args);
		console.log(`Commande | ${command.name} ${args} - ${message.author.username}`)
        if(message.channel.type === 'dm') return;
		message.delete()
	} catch (error) {
		console.error(error);
		message.reply(`Il y a eu une erreur lors de l'execution de la commande.\n\n\`${error.message}\``);
	}
});

client.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    let ticketdata = JSON.parse(fs.readFileSync('./tools/tickets.json'))
    let config = JSON.parse(fs.readFileSync('./tools/config.json'))
    let links = JSON.parse(fs.readFileSync('./tools/link.json'))
    const message = reaction.message;
    const member = message.guild.members.cache.get(user.id)
    const everyone = message.guild.roles.cache.find(role => role.name === '@everyone')
    let searcher = ticketdata.tickets.find(search => search === message.channel.id)

    if(["🎟️", "🔒","✔️","❌"].includes(reaction.emoji.name)) {
        switch(reaction.emoji.name) {
            case "🎟️":
                if(message.channel.id !== JSON.parse(fs.readFileSync('./tools/tickets.json')).opener) return;
            reaction.users.remove(member)
            let categoryID = links.pbAdmin; //Categorie ou mettre les tickets
            var bool = false;
            if(bool == true) return;
            message.guild.channels.create(`Ticket - ${user.username}`,{type: "text"}).then((createChan) => {
                createChan.setParent(categoryID).then((settedParent) => {
                    settedParent.overwritePermissions([
                        { id: member.id, allow: [ 'VIEW_CHANNEL' ] },
                        { id: everyone.id, deny: [ 'VIEW_CHANNEL' ] }
                      ])
                    sleep(1000)
                    let embedTicketOpen = new Discord.MessageEmbed()
                        .setTitle("Assistance Admin")
                        .setColor("#ff0000")
                        .setDescription("Merci de signaler votre problème ici. Les administrateurs y répondront dès que possible.")
                    settedParent.send(`${user}, voici votre ticket.`)
                    settedParent.send(embedTicketOpen).then( async msg => {
                        await msg.react("🔒")
                        let data = JSON.parse(fs.readFileSync('./tools/tickets.json'))
                        data.tickets.push(msg.channel.id)
                        fs.writeFileSync('./tools/tickets.json',JSON.stringify(data))
                    })
                })
            })
            break;
            case "🔒":
                if(!searcher) return;
            reaction.users.remove(member)
            message.channel.send("**Vous êtes sur le point de fermer votre ticket.\n En êtes vous sûr ?**").then(async verif => {
                await verif.react("✔️")
                await verif.react("❌")
            })
            break;
            case "❌" :
                if(!searcher) return;
                message.channel.bulkDelete(1)
                break;
            case "✔️" :
                if(!searcher) return;
                message.channel.send('**Suppression du channel dans** ***10*** **secondes.**')
                    setTimeout(() => {
                        message.channel.delete()
                    }, 10000)
                    let pos = ticketdata.tickets.indexOf(searcher)
                    ticketdata.tickets.splice(pos,1)
                    fs.writeFileSync('./tools/ticket.json', JSON.stringify(ticketdata))
        }
    }
})

client.on("channelCreate", async(verif) => { //Détecte si un channel a été crée (dans tout le serveur)
    let supportdate = new Date()
    let links = JSON.parse(fs.readFileSync('./tools/link.json'))
    let supportheure = supportdate.getHours()
    if(verif.parentID === links.aideCateg) { //Réduit à la catégorie AIDE (de par l'ID)
        if(supportheure >= 10 & supportheure < 23 ) {
        client.channels.cache.get(links.supportchan).send("information: Un joueur est présent en Support ||<@&591303157330739280>||").then((msg) => {
            setTimeout(() => {  
                msg.delete()
            },60000)
        }); //Send le msg
        }
        else {
            let role = verif.guild.roles.cache.find(role => role.id === links.supportrole)
            let arr = new Array();
            role.members.forEach(user => {
                arr.push(`<@${user.user.id}>`);
            });
            client.channels.cache.get(links.supportchan).send("test"+arr.join('\n')).then((msg) => {
                setTimeout(() => {  
                    msg.delete()
                },60000)
            });
        }
    }
});

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
