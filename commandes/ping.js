const Discord = require('discord.js');

exports.run = async(message, args) => {


    let debut = Date.now();
    await message.channel.send(':question: Ping :ping_pong: ').then(async(m) => {
        let now = Date.now();
        let ping = now - debut
        console.log(`<PING> ${ping} ms de ping`)
        await m.edit(`:exclamation: Pong: ${ping} ms :ping_pong: `)});
    message.delete();
};


exports.informations = {
    name : "ping",
    description : "Vous affiche la latence actuelle du bot",
    how: "`,ping`"
}