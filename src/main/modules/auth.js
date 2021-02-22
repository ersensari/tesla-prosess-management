import { ipcMain } from "electron";
import userRepo from "../database/repositories/user";

export default async function () {
  ipcMain.on("login", async (event, payload) => {
    try {
      const context = await userRepo.auth.login(JSON.parse(payload));
      event.reply("loginCompleted", context);
    } catch (error) {
      event.reply("loginError", { code: 401, message: error.message });
    }
  });
}
