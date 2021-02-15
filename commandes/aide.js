const { PREFIX } = require('../tools/config.json');
let prefix = PREFIX
const Discord = require('discord.js')

module.exports = {
	name: 'help',
	description: 'Liste de toutes les commandes ou information sur une commande spécifique.',
	aliases: ['aide'],
	usage: '{commande}',
	args: false,
	guildOnly : false,
	hide: false,
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commandes } = message.client;
		let commandList = new Discord.Collection();
		for (const commande of commandes) {
			if (!commande[1].hide) {
				if (commande[1].permissions) {
					if(message.channel.type !== "dm") {
						const authorPerms = message.channel.permissionsFor(message.author);
						if (authorPerms && authorPerms.has(commande[1].permissions)) {
							commandList.set(commande[1].name, commande[1])
						}
					}
				} else {
					commandList.set(commande[1].name, commande[1])
				}
			}
		}
        let listCommande = []
        commandList.forEach(element => {
            listCommande.push(`**${element.name}**\n${element.description}`)
        });
		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Liste des commandes :')
				.setColor('#ff0000')
				.setDescription(`${listCommande.join('\n\n')}\n\nVous pouvez faire \`${prefix}help [commande]\` pour récupérer des informations sur une commande spécifique!`)
				.setFooter(`${message.client.user.username} - c2021`)

			return message.author.send(embed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Je vous ai envoyé un message privé avec la liste de mes commandes!');
				})
				.catch(error => {
					console.error(`Impossible d'envoyer un DM à ${message.author.tag}.\n`, error);
					message.reply('Il semblerait que je ne puisse vous envoyer de messages privés!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commandes.get(name) || commandes.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Cette commande n\'est pas valide!');
		}
		const embed = new Discord.MessageEmbed()
		.setTitle(`**Commande:** ${command.name}`)
		.setColor('#ff0000')
		.setFooter(`${message.client.user.username} - c2021`)
		if (command.aliases) embed.addField(`**Alias:**`,`${command.aliases.join(', ')}`);
		if (command.description)embed.addField(`**Description:**`,`${command.description}`);
		if (command.usage) embed.addField(`**Usage:**`,`${prefix}${command.name} ${command.usage}`);

		embed.addField(`**Cooldown:**`,`${command.cooldown || 3} seconde(s)`);

		message.channel.send(embed);
	},
};