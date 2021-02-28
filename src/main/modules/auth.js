const { ipcMain } = require("electron");
const userRepo = require("../database/repositories/user");

module.exports = async () => {
  ipcMain.on("login", async (event, payload) => {
    try {
      const context = await userRepo.auth.login(JSON.parse(payload));
      event.reply("loginCompleted", context);
    } catch (error) {
      event.reply("loginError", { code: 401, message: error.message });
    }
  });
};
