const { Client, CommandInteraction, MessageFlags, ChannelType } = require('discord.js');

module.exports = {
    name: "say",
    description: "Envía un mensaje sin mostrar que se usó el comando",
    options: [
        {
            name: "canal",
            description: "Canal donde enviar el mensaje",
            type: 7,
            channel_types: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "mensaje",
            description: "Mensaje a enviar",
            type: 3,
            required: true,
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const allowed = process.env.SAY_ALLOWED_ID;
        
        if (!allowed) {
            return interaction.reply({
                content: "No está configurado el ID permitido.",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (interaction.user.id !== allowed) {
            return interaction.reply({
                content: "No tienes permiso para usar este comando.",
                flags: MessageFlags.Ephemeral,
            });
        }

        const channel = interaction.options.getChannel("canal");
        const message = interaction.options.getString("mensaje");

        try {
            // Responder de forma efímera primero
            await interaction.reply({
                content: "✓",
                flags: MessageFlags.Ephemeral,
            });
            // Luego enviar el mensaje al canal
            await channel.send({ content: message });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: "❌ Error al enviar el mensaje.",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
