module.exports = {
	name: 'clear',
	description: 'Supprimez une liste de messages',
	aliases: ['clr'],
	usage: '[nombre de messages]',
    permissions : "MANAGE_MESSAGES",
	args: true,
	guildOnly : true,
	hide: false,
	cooldown: 5,
	execute(message, args) {
        if(message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
            let longueur = parseInt(args.shift())
            if(longueur > 150 ) return message.channel.send("Erreur, vous êtes limité à 150 messages lors d'une suppression.")
            
            message.channel.bulkDelete(longueur)
            message.channel.send(`J'ai supprimé ${longueur} messages.`).then(msg => {
                sleep(2500)
                msg.delete()
            })
        } else if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) {
            let longueur = parseInt(args.shift())
            if(longueur > 30) return message.channel.send("Erreur, vous êtes limité à 30 messages lors d'une supression.")
            message.channel.bulkDelete(longueur)
            message.channel.send(`J'ai supprimé ${longueur} messages.`).then(msg => {
                sleep(2500)
                msg.delete()
            })
        }
	},
};


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}