const Discord = require("discord.js")
 
exports.run = (message, args) => {

  const embed = new Discord.MessageEmbed()
    .setTitle('SurvivalWorld BOT')
    .setDescription('BOT SUPPORT SURVIVALWORLD')
    .setColor('#00cc00')
    .setFooter('Crée par Gohan#0002 et Sotoamino#7721 | ,aide',"https://survivalworld.fr/img/uploads/theme_logo.png")
    .setImage('https://survivalworld.fr/img/uploads/theme_logo.png')
    .setAuthor("SurvivalWorld.fr : Survie 1.8 -> 1.16.2", "https://survivalworld.fr/img/uploads/theme_logo.png","https://survivalworld.fr/")
    .addField("Mon utilité:", "Je suis un bot utilitaire, qui partage certaines informations dans les salons aides.\nJe signale aussi, via mon activité, quelques informations tel que l'état des services du Support Général Survival World (Ouvert / Fermé) et d'autres informations utiles.")
  message.channel.send(embed);
}
 
exports.informations = {
  name : "botinfo",
  description : "Vous donne les informations sur le bot.",
  how: "`,botinfo`"
}