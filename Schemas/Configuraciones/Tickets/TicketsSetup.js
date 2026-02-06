const createModel = require("../../../utils/sqlite");

module.exports = createModel("tickets_setup", [
  "ServerID",
  "CanalID",
  "CategoriaID",
  "RolID",
]);
