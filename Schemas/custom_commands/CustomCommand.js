const createModel = require("../../utils/sqlite");

module.exports = createModel("custom_commands", [
  "guildId",
  "commandName",
  "commandId",
  "content",
]);
