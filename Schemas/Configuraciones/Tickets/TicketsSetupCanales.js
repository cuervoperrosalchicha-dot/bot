const createModel = require("../../../utils/sqlite");

module.exports = createModel("tickets_setup_canales", [
  "ServerID",
  "Canal",
  "AuthorID",
  "Cerrado",
]);
