const Discord = require('discord.js')
const fs = require("fs")

exports.run = (message, args) => {
    let content = []
    const embedHelp = new Discord.MessageEmbed()
    .setTitle('Commandes')
    .setDescription('Liste des commandes.')
    .setColor("#"+((1<<24)*Math.random()|0).toString(16))
    .setFooter('Commandes bot support SurvivalWorld')
    fs.readdir('./commandes/',(error, f) => {
        if(error) console.log(error);
        let commandes = f.filter(f => f.split('.').pop() === 'js');
        if(commandes.length <= 0) return embedHelp.addField('Aucune commandes', 'Tiens, aucune commande n`\'a été trouvé...');
        commandes.forEach((f) => {
            const TEST = require(`./${f}`)
            content.push({name:`${TEST.informations.name}`, value:TEST.informations.description+"\n"+TEST.informations.how+"\n" })
        });
        embedHelp.addFields(content)
        message.channel.send(embedHelp)
    });


}

exports.informations = {
    name : "aide",
    description : "Vous donne la liste des commandes disponibles.",
    how: "`,aide`"
}