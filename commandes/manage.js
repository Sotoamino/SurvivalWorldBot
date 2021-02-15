const fs = require('fs');

module.exports = {
	name: 'manage',
	description: 'Liste des options :\n    ***prefix NouveauPrefix*** => Vous permet de modifier le préfix du bot. \n    ***supportchan #salon*** => Vous permet de modifier le salon des alertes insultes / des alertes vocal support.\n    ***aidechan #Salon*** => Vous permet de modifier le salon aide pour les redirection des joueurs.',
	usage: '[option] [valeur]',
    aliases: ['mng'],
    permissions : "MANAGE_ROLES",
	args: true,
	guildOnly : true,
	hide: false,
	cooldown: 5,
	execute(message, args) {
        let subcommand = args.shift();
        if(subcommand === "prefix") {
            if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande.")
            let prefix = args.shift()
            opt.PREFIX = prefix
            message.channel.send('Nouveau prefix défini à :'+opt.PREFIX)
            fs.writeFileSync('./tools/config.json', JSON.stringify(opt))
        } else if(subcommand === "aidechan") {
            if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande.")

            let links = JSON.parse(fs.readFileSync('./tools/link.json'))
            links.aidechan = args.shift().substring(2,salon.length-1);
            fs.writeFileSync('./tools/link.json', JSON.stringify(links))
        }
        else if(subcommand === "supportchan") {
            if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande.")

            let links = JSON.parse(fs.readFileSync('./tools/link.json'))
            links.supportchan = args.shift().substring(2,salon.length-1);
            fs.writeFileSync('./tools/link.json', JSON.stringify(links))
        }
	},
};