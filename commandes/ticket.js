const Discord = require('discord.js');
const fs = require('fs')
let data = JSON.parse(fs.readFileSync('./discord_links.json'))

exports.run = (message, args) => {
    if(!message.guild.member(message.author).hasPermission(data.ticket_permission_creator)) return;
    const TicketEmbed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setAuthor("Problème Admin")
    .setDescription("Si vous rencontrez un problème nécessitant l'intervention d'un administrateur, veuillez ouvrir un ticket") 
    message.channel.send(TicketEmbed).then(async msg => {
        msg.react("🎟️")
        let data = JSON.parse(fs.readFileSync('./ticket.json'))
        data.tickets.push(msg.channel.id)
        fs.writeFileSync('./ticket.json',JSON.stringify(data))
    })
}

exports.informations = {
    name : "ticket",
    description : "Commande administrative. Créez un ticket",
    how : "`,ticket`"
}