const Discord = require('discord.js');

exports.run = (message, args) => {
    if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")){
        return message.channel.send(":warning: Erreur ! Vous n'avez pas la permission d'éxecuter cette commande.");
    }
    if(!args[0]) {
        return message.reply(`Syntaxe: ,clear <le nombre de message à supprimer>`);
    };
    message.delete();
    message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send(`J'ai supprimé **${args[0]} message** !`).then((msgClearReturn => {
            setTimeout(() => {  
                msgClearReturn.delete()
            },3000)
        }))
    });
};

exports.informations = {
    name : "clear",
    description : "Vous permet de supprimer un certains nombre de messages",
    how: "`,clear <nombre de messages à supprimer>`"
}