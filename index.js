const Discord = require("discord.js");
const fs = require('fs');

const BOTdata = JSON.parse(fs.readFileSync('./tools/config.json'));

const client = new Discord.Client();
client.login(BOTdata.TOKEN);

client.on('ready', () => {
    console.log("Bot connecté.")
    setInterval(() => {
        let data = JSON.parse(fs.readFileSync('./tools/statut.json')).messages
        data = data[getRandomInt(data.length)]
        client.user.setPresence(data)
    },10000)
})

client.on('ready', () => {
    const config = JSON.parse(fs.readFileSync('./tools/messages.json'))
    const links = JSON.parse(fs.readFileSync('./tools/link.json')); // recuperer les données
    var c = client.guilds.cache.get(links.swLink).channels.cache.get(links.aidechan);
    setInterval(() => {
        let messages = config.automessages
        let message = messages[getRandomInt(messages.length)]
        const AutoEmbed = new Discord.MessageEmbed()
            .setTitle(message.title)
            .setColor("RANDOM")
            .setDescription(message.content.name+"\n"+message.content.value)
            .setImage(message.image)
            .setFooter("Le support SurvivalWorld", "https://survivalworld.fr/img/uploads/theme_logo.png")
        c.send(AutoEmbed)
    }, 1000);
})

client.on('message', (message) => { //envoi vers le salon aide si
    const data = JSON.parse(fs.readFileSync('./tools/config.json')); // récupérer les données
    const links = JSON.parse(fs.readFileSync('./tools/link.json')); // recuperer les données
    const list = JSON.parse(fs.readFileSync('./tools/list.json')); // recuperer les données
    if(message.author.bot || message.content.startsWith(data.PREFIX)) return; //filtre
    if(message.channel.id === links.aidechan || message.channel.parentID === links.pbAdmin) return;//si dans salon aide
    if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return; //filtre
    let i = 0
    const args = message.content.toLowerCase() //contenu du message tout en minuscule
    while(i <= list.aide.length) {
        if(args.includes(list.aide[i]) || message.mentions.users.first() === client.user) { //analyse si message contient mot précis
            const embed = new Discord.MessageEmbed()
                .setTitle("Besoin d'aide ?")
                .setColor("#5cb85c")
                .setDescription(`Tu as besoin d'aide ${message.author.username} ? Notre équipe support est prête à te répondre.\nRetrouve les [ici](https://discord.com/channels/${links.swLink}/${links.aidechan})`)
            return message.reply(embed)
        }
        i += 1
    }
})//END

client.on('message', message => {
    const data = JSON.parse(fs.readFileSync('./tools/config.json')); // récupérer les données
    const list = JSON.parse(fs.readFileSync('./tools/list.json')); // recuperer les données
    const links = JSON.parse(fs.readFileSync('./tools/link.json')); // recuperer les données
    if(message.author.bot || message.content.startsWith(data.PREFIX)) return; //filtre
    const content = message.content.trim().split(/ +/g);
    const args = message.content.toLowerCase() //contenu du message tout en minuscule
    let i = 0
    if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return; //filtre
    while(i <= list.blacklist.length) {
        if(args.includes(list.blacklist[i])) {
            let salon = message.guild.channels.cache.find(ch => ch.id === links.supportchan)
            const embed = new Discord.MessageEmbed()
                .setTitle(`Avertissement Langage - ${message.author.username}`)
                .setColor("#ff0000")
            .setDescription(`Joueur : ${message.author.tag} [${message.author.id}]\nSalon : [${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})\nContenu du message : [${message.content}](${message.url})`)
                .setTimestamp()
            return salon.send(embed)
        }
        i += 1
    }
})

client.on('message', message => {
    const opt = JSON.parse(fs.readFileSync('./tools/config.json')); // récupérer les données
    if(message.author.bot || !message.content.startsWith(opt.PREFIX)) return;
    const args = message.content.slice(opt.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()



    if(command === "aide" || command === "help") {
        let content = JSON.parse(fs.readFileSync('./tools/help.json'))
        let opt = JSON.parse(fs.readFileSync('./tools/config.json'))

        u = 0
        let text = ""

        const embed = new Discord.MessageEmbed()      
            .setTitle("AIDE - Liste des commandes")
            .setColor("#ffa500")
            .setDescription("Prefix : "+opt.PREFIX)
            .setFooter(opt.PREFIX+"aide - Made By SurvivalWorld")
        if(message.guild.member(message.author).hasPermission("ADMINISTRATOR")) {
            text = "admin"
        } else if(message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
            text = "rs"
        } else if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) {
            text = "staff"
        } else {
            text = "player"
        }
        let obj = content[text]
        while (u < obj.length) {
            obj[u].name = opt.PREFIX+obj[u].name
            u+= 1
        }
        embed.addFields(content[text])
        message.channel.send(embed)
    }
    
    
    
    else if(command === "clear" || command === "clr") {
        if(message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
            let longueur = parseInt(args.shift())
            if(longueur > 150 ) return message.channel.send("Erreur, vous êtes limité à 150 messages lors d'une suppression.")
            
            message.channel.bulkDelete(longueur)
            message.channel.send(`J'ai supprimé ${longueur} messages.`).then(msg => {
                sleep(2500)
                msg.delete()
            })
        } else if(message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) {
            let longueur = parseInt(args.shift())
            if(longueur > 30) return message.channel.send("Erreur, vous êtes limité à 30 messages lors d'une supression.")
            message.channel.bulkDelete(longueur)
            message.channel.send(`J'ai supprimé ${longueur} messages.`).then(msg => {
                sleep(2500)
                msg.delete()
            })
        } else return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande")
    }
    
    
    
    else if (command === "manage") {
        let subcommand = args.shift();
        if(subcommand === "prefix") {
            if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande.")
            let prefix = args.shift()
            opt.PREFIX = prefix
            message.channel.send('Nouveau prefix défini à :'+opt.PREFIX)
            fs.writeFileSync('./tools/config.json', JSON.stringify(opt))
        } else if(subcommand === "aidechan") {
            if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande.")

            let links = JSON.parse(fs.readFileSync('./tools/link.json'))
            links.aidechan = args.shift().substring(2,salon.length-1);
            fs.writeFileSync('./tools/link.json', JSON.stringify(links))
        }
        else if(subcommand === "supportchan") {
            if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande.")

            let links = JSON.parse(fs.readFileSync('./tools/link.json'))
            links.supportchan = args.shift().substring(2,salon.length-1);
            fs.writeFileSync('./tools/link.json', JSON.stringify(links))
        }
    }
    
    
    
    else if(command === "ticket"){
        if(message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.channel.send("Erreur, vous n'avez pas la permission d'éxecuter cette commande.")
        const TicketEmbed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setAuthor("Problème Admin")
        .setDescription("Si vous rencontrez un problème nécessitant l'intervention d'un administrateur, veuillez ouvrir un ticket") 
        message.channel.send(TicketEmbed).then(async msg => {
            msg.react("🎟️")
            let data = JSON.parse(fs.readFileSync('./tools/tickets.json'))
            data.tickets.push(msg.channel.id)
            fs.writeFileSync('./tools/tickets.json',JSON.stringify(data))
        })
    }
    
    
    
    else if(command === "managemsg"){
        if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.channel.send(":warning: Erreur ! Vous n'avez pas la permission d'éxecuter cette commande.");
        if(!args[0]) return message.reply("Syntaxe: `"+opt.PREFIX+"managemsg <add | view | del>`")
        if(args[0] === "add") {
            if(!args[1]) return message.channel.send("Erreur, vous devez mettre le message à ajouter tel que <titre> == <message>")
            let data = JSON.parse(fs.readFileSync("./tools/messages.json"))
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
            fs.writeFileSync('./tools/messages.json', JSON.stringify(data))
            const embedAdd = new Discord.MessageEmbed()
                .setTitle("Ajout de message")
                .setDescription(`Bonjour ${message.author.username} Vous avez parfaitement ajouté le message suivant à la liste des messages automatiques.`)
                .addField(newm.content.name,newm.content.value)
                .setFooter("Pannel Responsable Staff - Ajout de messages automatiques")
            message.channel.send(embedAdd)
        }
        if(args[0] === "view") {
            let data = JSON.parse(fs.readFileSync("./tools/messages.json"))
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
            if(!args[1]) return message.channel.send("Erreur, vous devez mettre l'identifiant du message (voir `"+opt.PREFIX+"managemsg view`)")
            let data = JSON.parse(fs.readFileSync("./tools/messages.json"))
            let retour = data.automessages.splice(data.automessages.indexOf(data.automessages.find(msg => msg.id === args[1])))
            if(!retour) return message.channel.send("Aucun message ,n'a été trouvé avec l'identifiant "+args[1])
            message.reply("Vous avez supprimé le message suivant :")
            const embedDel = new Discord.MessageEmbed()
                .setTitle("Supression de message automatique")
                .setDescription(`Bonjour ${message.author.username} Vous avez parfaitement supprimé le message suivant à la liste des messages automatiques.`)
                .addField(retour[0].content.name, retour[0].content.value)
                .setFooter("Pannel Responsable Staff - Ajout de messages automatiques")
                message.channel.send(embedDel)
            fs.writeFileSync('./tools/messages.json', JSON.stringify(data))
        }
    }
    
    
    else if (command === "botinfo") {
        const embed = new Discord.MessageEmbed()
            .setTitle('SurvivalWorld BOT')
            .setDescription('BOT SUPPORT SURVIVALWORLD')
            .setColor('#00cc00')
            .setFooter('Crée par Gohan#0002 et Sotoamino#7721 | ,aide',"https://survivalworld.fr/img/uploads/theme_logo.png")
            .setImage('https://survivalworld.fr/img/uploads/theme_logo.png')
            .setAuthor("SurvivalWorld.fr : Survie 1.8 -> 1.16.2", "https://survivalworld.fr/img/uploads/theme_logo.png","https://survivalworld.fr/")
            .addField("Mon utilité:", "Je suis un bot utilitaire, qui partage certaines informations dans les salons aides.")
        message.channel.send(embed);
    }
    message.delete()
})





client.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    let ticketdata = JSON.parse(fs.readFileSync('./tools/tickets.json'))
    let config = JSON.parse(fs.readFileSync('./tools/config.json'))
    let links = JSON.parse(fs.readFileSync('./tools/link.json'))
    const message = reaction.message;
    const member = message.guild.members.cache.get(user.id)
    const everyone = message.guild.roles.cache.find(role => role.name === '@everyone')
    let searcher = ticketdata.tickets.find(search => search === message.channel.id)
    if(!searcher) return;
    if(["🎟️", "🔒","✔️","❌"].includes(reaction.emoji.name)) {
        switch(reaction.emoji.name) {
            case "🎟️":
            reaction.users.remove(member)
            let categoryID = links.pbAdmin; //Categorie ou mettre les tickets
            var bool = false;
            if(bool == true) return;
            message.guild.channels.create(`Ticket - ${user.username}`,{type: "text"}).then((createChan) => {
                createChan.setParent(categoryID).then((settedParent) => {
                    settedParent.overwritePermissions([
                        { id: member.id, allow: [ 'VIEW_CHANNEL' ] },
                        { id: everyone.id, deny: [ 'VIEW_CHANNEL' ] }
                      ])
                    sleep(1000)
                    let embedTicketOpen = new Discord.MessageEmbed()
                        .setTitle("Assistance Admin")
                        .setColor("#ff0000")
                        .setDescription("Merci de signaler votre problème ici. Les administrateurs y répondront dès que possible.")
                    settedParent.send(`${user}, voici votre ticket.`)
                    settedParent.send(embedTicketOpen).then( async msg => {
                        await msg.react("🔒")
                        let data = JSON.parse(fs.readFileSync('./tools/tickets.json'))
                        data.tickets.push(msg.channel.id)
                        fs.writeFileSync('./tools/tickets.json',JSON.stringify(data))
                    })
                })
            })
            break;
            case "🔒":
            reaction.users.remove(member)
            message.channel.send("**Êtes vous sûr ?**").then(async verif => {
                await verif.react("✔️")
                await verif.react("❌")
            })
            break;
            case "❌" :
                message.channel.bulkDelete(1)
                break;
            case "✔️" :
                message.channel.send('**Suppression du channel dans** ***10*** **secondes.**')
                    setTimeout(() => {
                        message.channel.delete()
                    }, 10000)
                    let pos = ticketdata.tickets.indexOf(searcher)
                    ticketdata.tickets.splice(pos,1)
                    fs.writeFileSync('./tools/ticket.json', JSON.stringify(ticketdata))
        }
    }
})

client.on("channelCreate", async(verif) => { //Détecte si un channel a été crée (dans tout le serveur)
    let supportdate = new Date()
    let links = JSON.parse(fs.readFileSync('./tools/link.json'))
    let supportheure = supportdate.getHours()
    if(verif.parentID === links.aideCateg) { //Réduit à la catégorie AIDE (de par l'ID)
        if(supportheure >= 10 & supportheure < 23 ) {
        client.channels.cache.get(links.supportchan).send("information: Un joueur est présent en Support ||<@&591303157330739280>||").then((msg) => {
            setTimeout(() => {  
                msg.delete()
            },60000)
        }); //Send le msg
        }
        else {
            client.channels.cache.get(links.supportchan).send("information: Un joueur est présent en Support").then((msg) => {
                setTimeout(() => {  
                    msg.delete()
                },60000)
            }); //Send le msg 
        }
    }
});


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}