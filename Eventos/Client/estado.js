const { ActivityType } = require("discord.js");
const createModel = require("../../utils/sqlite");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
	// Inicializar modelos para crear tablas si no existen
	createModel("custom_commands", ["guildId", "commandName", "commandId", "content"]);
	createModel("tickets_setup", ["ServerID", "CanalID", "CategoriaID", "RolID"]);
	createModel("tickets_setup_canales", ["ServerID", "Canal", "AuthorID", "Cerrado"]);

	console.log("» | Conectado a la base de datos sqlite".green);

	console.log("» | Estado cargado con exito".cyan);

		const statusarray = [
			{
				name: "Jugando",
				type: ActivityType.Listening,
				status: "idle",
			},
			{
				name: "Jugando 1,2, 3",
				type: ActivityType.Listening,
				status: "idle",
			},
		];

		setInterval(() => {
			const option = Math.floor(Math.random() * statusarray.length);

			client.user.setPresence({
				activities: [
					{
						name: statusarray[option].name,
						type: statusarray[option].type,
						url: statusarray[option].url,
					},
				],
				status: statusarray[option].status,
			});
		}, 5000); //5000 = 5 segundos | 10000 = 10 segundos
	},
};

/*
╔═══════════════════════════════════════════════════╗
║  || - ||   Código por ALDA#8939/el_alda   || - |  ║
║     --|   https://discord.gg/JpKGJFZCzK    |--    ║
╚═══════════════════════════════════════════════════╝
*/
