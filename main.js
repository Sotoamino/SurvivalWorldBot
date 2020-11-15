const Discord = require("discord.js");
const tool = require("./tool.js");
const fs = require('fs')

let data = JSON.parse(fs.readFileSync("./config.json"))

let links = JSON.parse(fs.readFileSync("./discord_links.json"))

const bot = new Discord.Client()
bot.login(data.token)

bot.on('ready', () => {
    tool.autoMSG(bot)
    tool.BotStart(bot)
})

bot.on('message', (message) => {
    if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGE")) return;
    //commandes de développeurs
    let prefix = data.prefix
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(message.channel.type === 'dm') return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let commandeName = args.shift()
    fs.stat(`./commandes/${commandeName}.js`, function(err, stat) {
        if (err === null) { 
            const commandeAction = require(`./commandes/${commandeName}.js`)
            console.log(`þ | Commande ${commandeName} effectué par ${message.author.username}`)
            commandeAction.run(message,args)
            message.delete()
        }
        else {
            message.channel.send('Commande introuvable.')
        }
    }); 
});


bot.on("channelCreate", async(verif) => { //Détecte si un channel a été crée (dans tout le serveur)
    let supportdate = new Date()
    let supportheure = supportdate.getHours()
    if(verif.parentID === links.category_aide_id) { //Réduit à la catégorie AIDE (de par l'ID)
        if(supportheure >= 10 & supportheure < 23 ) {
        client.channels.cache.get(link.support_channel_id).send("information: Un joueur est présent en Support ||<@&591303157330739280>||").then((msg) => {
            setTimeout(() => {  
                msg.delete()
            },60000)
        }); //Send le msg
        }
        else {
            client.channels.cache.get(link.support_channel_id).send("information: Un joueur est présent en Support").then((msg) => {
                setTimeout(() => {  
                    msg.delete()
                },60000)
            }); //Send le msg 
        }
    }
});

bot.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    let ticketdata = JSON.parse(fs.readFileSync('./ticket.json'))
    const message = reaction.message;
    const member = message.guild.members.cache.get(user.id)
    const everyone = message.guild.roles.cache.find(role => role.name === '@everyone')
    let searcher = ticketdata.tickets.find(search => search === message.channel.id)
    console.log(searcher)
    if(!searcher) return;
    if(["🎟️", "🔒","✔️","❌"].includes(reaction.emoji.name)) {
        switch(reaction.emoji.name) {
            case "🎟️":
            reaction.users.remove(member)
            let categoryID = links.probleme_admin_category_id; //Categorie ou mettre les tickets
            var bool = false;
            if(bool == true) return;
            message.guild.channels.create(`Ticket - ${user.username}`,{type: "text"}).then((createChan) => {
                createChan.setParent(categoryID).then((settedParent) => {
                    sleep(500)
                    settedParent.overwritePermissions([
                        {id: member,allow:['VIEW_CHANNEL']},
                        {id: everyone.id,deny:['VIEW_CHANNEL']}
                    ])
                    sleep(1000)
                     let embedTicketOpen = new Discord.MessageEmbed()
                        .setTitle("Assistance Admin")
                        .setColor("#ff0000")
                        .setDescription("Merci de signaler votre problème ici. Les administrateurs y répondront dès que possible.")
                    settedParent.send(`${user}, voici votre ticket.`)
                    settedParent.send(embedTicketOpen).then( async msg => {
                        await msg.react("🔒")
                        let data = JSON.parse(fs.readFileSync('./ticket.json'))
                        data.tickets.push(msg.channel.id)
                        fs.writeFileSync('./ticket.json',JSON.stringify(data))
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
                    console.log(ticketdata)
                    let pos = ticketdata.tickets.indexOf(searcher)
                    ticketdata.tickets.splice(pos,1)
                    console.log(ticketdata)
                    fs.writeFileSync('./ticket.json', JSON.stringify(ticketdata))
        }
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}