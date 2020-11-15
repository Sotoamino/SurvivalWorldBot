const Discord = require('discord.js');
const fs = require('fs')

let data = JSON.parse(fs.readFileSync('./discord_links.json'))

exports.run = async(message, args) => {
    if(!args[0]) {
        args = ["Aucune","raison","fournie"]
    }
    var date = new Date()
    var h=date.getHours();
        if (h<10) {h = "0" + h}
    var m=date.getMinutes();
        if (m<10) {m = "0" + m}
    var s=date.getSeconds();
        if (s<10) {s = "0" + s}

    let embedtoad = new Discord.MessageEmbed()
    .setTitle(`Problème de ${message.author.username}`)
    .setColor('#ff0000')
    .setDescription(`Problème/question du joueur: **${args.join(" ")}**.`)
    .setFooter(`Date: ${date.getDate()}/${date.getMonth()+1}/${date.getUTCFullYear()} - ${h}:${m}:${s}`)

    let embedtopl = new Discord.MessageEmbed()
    .setTitle('Rappel de votre problème')
    .setColor('#ff0000')
    .setDescription(`Vous avez contacté l\'administration avec succès le **${date.getDate()}/${date.getMonth()+1}/${date.getUTCFullYear()} - ${h}:${m}:${s}**\npour la raison suivante: **${args.join(" ")}**.`)
    
    
    
    client.users.cache.get(bot_admin_id).send(embedtoad)
    message.author.send(embedtopl)
    message.delete();
};


exports.informations = {
    name : "contact",
    description : "Vous permet de contacter les créateurs du bot.",
    how: "`,contact [votre message]`"
}