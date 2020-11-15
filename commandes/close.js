const Discord = require('discord.js');
const fs = require('fs')

let data = JSON.parse(fs.readFileSync('./discord_links.json'))

exports.run = async(message, args) => {
    if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){
        return message.channel.send(":warning: Erreur ! Vous n'avez pas la permission d'éxecuter cette commande.");
    }

    const EmbedDeletion = new Discord.MessageEmbed()
        .setTitle("Supression du channel.")
        .setDescription("Vous voulez vraiment supprimer ce channel ?")
        .setFooter("Supression de ticket - Bot Support SurvivalWorld")
    message.channel.send(EmbedDeletion).then(async msg => {
        await msg.react("✔️")
        await msg.react("❌")
    })
};


exports.informations = {
    name : "close",
    description : "Vous met un message de fermeture de ticket (si le ticket est buggué)",
    how: "`,close`"
}