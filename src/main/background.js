"use strict";

const {
  app,
  protocol,
  BrowserWindow,
  Menu,
  ipcMain,
  session,
} = require("electron");
const { createProtocol } = require("vue-cli-plugin-electron-builder/lib");
const electronLocalshortcut = require("electron-localshortcut");
const path = require("path");
const electron_data = require("electron-data");
const modules = require("./modules");
const { readFile, stat } = require("fs");

const appPath =
  process.env.NODE_ENV === "production"
    ? `${process.resourcesPath}/app`
    : __dirname;

electron_data.config({
  filename: "user.json",
  path: appPath,
  autosave: true,
  lastUpdate: true,
});

stat(appPath + "/user.json", (err, stats) => {
  if (!err) {
    readFile(appPath + "/user.json", { encoding: "utf-8" }, (_, data) => {
      electron_data.set(
        "topWindowLocation",
        JSON.parse(data).topWindowLocation
      );
    });
  }
});

const isDevelopment = process.env.NODE_ENV !== "production";
let topWindow = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createTopWindow() {
  let pos = null;
  if (await electron_data.has("topWindowLocation")) {
    pos = await electron_data.get("topWindowLocation");
  }

  topWindow = new BrowserWindow({
    ...pos,
    width: 64,
    height: 64,
    alwaysOnTop: true,
    frame: false,
    thickFrame: false,
    show: false,
    resizable: false,
    closable: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  topWindow.on("close", function () {
    topWindow = null;
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await topWindow.loadURL(
      path.join(process.env.WEBPACK_DEV_SERVER_URL, "topWindow.html")
    );
  } else {
    await topWindow.loadURL(path.join("file://", __dirname, "topWindow.html"));
  }

  topWindow.showInactive();

  topWindow.on("moved", (args) => {
    electron_data.set("topWindowLocation", {
      x: args.sender.getPosition()[0],
      y: args.sender.getPosition()[1],
    });
  });
}

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: "tesla-icon.ico",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  win.on("focus", (event) => {
    if (topWindow !== null) {
      topWindow.close();
    }

    electronLocalshortcut.register(
      win,
      ["CommandOrControl+R", "CommandOrControl+Shift+R", "F5"],
      () => {}
    );
  });

  win.on("blur", (event) => {
    createTopWindow();
    electronLocalshortcut.unregisterAll(win);
  });

  ipcMain.on("openMainWindow", () => {
    win.show();
    win.focus();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

async function setMainMenu() {
  const template = [
    {
      label: "Tesla Üretim Yönetimi",
      submenu: [
        {
          label: "Quit",
          role: "quit",
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }

  session.defaultSession.clearStorageData();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  createWindow();
  setMainMenu();
  modules.forEach((m) => m());
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
