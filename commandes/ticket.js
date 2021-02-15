const fs = require('fs');
const Discord = require('discord.js')

module.exports = {
	name: 'ticket',
	description: 'Vous permet d\'afficher le message d\'ouverture de ticket pour les problèmes admins.',
    permissions : "MANAGE_ROLES",
	args: false,
	guildOnly : true,
	hide: false,
	cooldown: 5,
	execute(message, args) {
        const TicketEmbed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setAuthor("Problème Admin")
        .setDescription("Si vous rencontrez un problème nécessitant l'intervention d'un administrateur, veuillez ouvrir un ticket") 
        message.channel.send(TicketEmbed).then(async msg => {
            msg.react("🎟️")
            let data = JSON.parse(fs.readFileSync('./tools/tickets.json'))
            data.opener = msg.channel.id
            fs.writeFileSync('./tools/tickets.json',JSON.stringify(data))
        })
	},
};
