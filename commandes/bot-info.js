

module.exports = {
	name: 'bot-info',
	description: 'Vous donne quelques informations sur le bot.',
	aliases: ['botinfo'],
	args: false,
	guildOnly : false,
	hide: false,
	cooldown: 5,
	execute(message, args) {
            const embed = new Discord.MessageEmbed()
            .setTitle('SurvivalWorld BOT')
            .setDescription('BOT SUPPORT SURVIVALWORLD')
            .setColor('#00cc00')
            .setFooter('Crée par Gohan#0002 et Sotoamino#7721 | ,aide',"https://survivalworld.fr/img/uploads/theme_logo.png")
            .setImage('https://survivalworld.fr/img/uploads/theme_logo.png')
            .setAuthor("SurvivalWorld.fr : Survie 1.8 -> 1.16.2", "https://survivalworld.fr/img/uploads/theme_logo.png","https://survivalworld.fr/")
            .addField("Mon utilité:", "Je suis un bot utilitaire, qui partage certaines informations dans les salons aides.")
            message.channel.send(embed);
    },
};


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}