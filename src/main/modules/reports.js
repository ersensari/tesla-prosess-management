const { ipcMain } = require("electron");
const Repo = require("../database/repositories/reports");
const MODULE_NAME = "reports";

module.exports = async () => {
  ipcMain.on(MODULE_NAME + ".flatProductionList", async (event, criteria) => {
    try {
      const context = await Repo.queries.flatProductionList(criteria);
      event.reply(MODULE_NAME + ".flatProductionListCompleted", context);
    } catch (error) {
      event.reply(MODULE_NAME + ".flatProductionListError", {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + ".findByPk", async (event, id) => {
    try {
      const context = await Repo.queries.findByPk(id);
      event.reply(MODULE_NAME + ".findByPkCompleted", context.toJSON());
    } catch (error) {
      event.reply(MODULE_NAME + ".findByPkError", {
        code: 505,
        message: error.message,
      });
    }
  });
};
