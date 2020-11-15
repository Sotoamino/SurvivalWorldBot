const Discord = require('discord.js');
const fs = require("fs");
const { getEffectiveConstraintOfTypeParameter } = require('typescript');

exports.run = (message, args) => {
    if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")){
        return message.channel.send(":warning: Erreur ! Vous n'avez pas la permission d'éxecuter cette commande.");
    }
    if(!args[0]) {
        return message.reply(`Syntaxe: \`,manage <add | view | del>\``);
    };
    if(args[0] === "add") {
        if(!args[1]) return message.channel.send("Erreur, vous devez mettre le message à ajouter tel que <titre> == <message>")
        let data = JSON.parse(fs.readFileSync("./messages.json"))
        args.splice(0, 1)
        let contenu = args.join(" ").split("==");
        let newm = {
            id : (data.automessages.length+1).toString(),
            title : ":pushpin: __**Informations**__ :pushpin:",
            content : {
                name : contenu[0],
                value : contenu[1]
            },
            image : ""
        }
        data.automessages.push(newm)
        fs.writeFileSync('./messages.json', JSON.stringify(data))
        const embedAdd = new Discord.MessageEmbed()
            .setTitle("Ajout de message")
            .setDescription(`Bonjour ${message.author.username} Vous avez parfaitement ajouté le message suivant à la liste des messages automatiques.`)
            .addField(newm.content.name,newm.content.value)
            .setFooter("Pannel Responsable Staff - Ajout de messages automatiques")
        message.channel.send(embedAdd)
    }
if(args[0] === "view") {
    let data = JSON.parse(fs.readFileSync("./messages.json"))
    cpt = 1
    let tab = []
    const embed = new Discord.MessageEmbed()
        .setTitle("Liste des messages")
        .setDescription("Couleur : Aléatoire\nTitre : :pushpin: __**Informations**__ :pushpin:\n\nAffichage tel que : \n`identifiant` - Titre\nContenu du message")
        .setColor("RANDOM")
        .setFooter("Pannel Responsable Staff - Vue des messages automatiques")
        while(cpt <= data.automessages.length) {
            tab.push({name : "`"+data.automessages[cpt-1].id+"` - "+ data.automessages[cpt-1].content.name, value: data.automessages[cpt-1].content.value})
            cpt +=1
        }
        embed.addFields(tab)
        message.reply(embed)
}
if(args[0] === "del") {
    if(!args[1]) return message.channel.send("Erreur, vous devez mettre l'identifiant du message (voir `,manage view`)")
    let data = JSON.parse(fs.readFileSync("./messages.json"))
    let retour = data.automessages.splice(data.automessages.indexOf(data.automessages.find(msg => msg.id === args[1])))
    if(!retour) return message.channel.send("Aucun message ,n'a été trouvé avec l'identifiant "+args[1])
    message.reply("Vous avez supprimé le message suivant :")
    const embedDel = new Discord.MessageEmbed()
        .setTitle("Supression de message automatique")
        .setDescription(`Bonjour ${message.author.username} Vous avez parfaitement ajouté le message suivant à la liste des messages automatiques.`)
        .addField(retour[0].content.name, retour[0].content.value)
        .setFooter("Pannel Responsable Staff - Ajout de messages automatiques")
        message.channel.send(embedDel)
    fs.writeFileSync('./messages.json', JSON.stringify(data))
}
};

exports.informations = {
    name : "manage",
    description : "Commande Responsable Staff : Vous permet de gérer les messages automatiques",
    how: "`,manage <add | view | del>`"
}