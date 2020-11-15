const fs = require("fs")
const Discord = require('discord.js')
const config = JSON.parse(fs.readFileSync('./config.json'))

let links = JSON.parse(fs.readFileSync("./discord_links.json"))

exports.BotStart = (client) => {
    console.log('ℹ | Bot actif');
    let status = ""
    setInterval(() => {
        var date = new Date()
        if(date.getHours()>= 10 & date.getHours()< 23) {
            state = 'online'
            status = ["Support Ouvert","Disponible de 10h à 23h !","play.survivalworld.fr"];

        }
        else {
            state = 'dnd'
            status = ["Support Fermé","Disponible de 10h à 23h !","play.survivalworld.fr"];
        }
        let statut = status[Math.floor(Math.random()*status.length)];
        client.user.setPresence({ activity: {name: statut} , status: state });
    }, 1000);
}

exports.autoMSG = (client) => {
    const config = JSON.parse(fs.readFileSync('./messages.json'))
    var c = client.guilds.cache.get(links.survivalworld_discord_id).channels.cache.get(links.salon_aide_id);
    setInterval(() => {
        let messages = config.automessages
        let message = messages[getRandomInt(messages.length)]
        const AutoEmbed = new Discord.MessageEmbed()
            .setTitle(message.title)
            .setColor("RANDOM")
            .setDescription(message.content.name+"\n"+message.content.value)
            .setImage(message.image)
            .setFooter("Le support SurvivalWorld", config.gif)
        c.send(AutoEmbed)
    }, 21600000);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }