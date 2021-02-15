module.exports = {
	name: 'close',
	description: 'Vous permet d\'afficher le message de fermeture des tickets en cas de bug (réactions non-fonctionnels).',
    permissions : "MANAGE_MESSAGES",
	guildOnly : true,
	hide: false,
	cooldown: 5,
	execute(message, args) {
        message.channel.send("**Vous êtes sur le point de fermer votre ticket.\n En êtes vous sûr ?**").then(async verif => {
            await verif.react("✔️")
            await verif.react("❌")
        })
	},
};