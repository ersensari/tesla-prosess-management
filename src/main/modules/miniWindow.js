const { ipcMain } = require("electron");
let window = null;
module.exports = async (w) => {
  window = w;
  if (window) {
    ipcMain.on("GET_SELECTED_ORDER", (_, order) => {
      if (window && window.webContents)
        window.webContents.send("miniWindowSelectedOrder", order);
    });
  }
};
