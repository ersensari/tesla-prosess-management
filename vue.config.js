const { join } = require("path");
module.exports = {
  configureWebpack: {
    devtool: "source-map",
    resolve: {
      alias: {
        "@": join(__dirname, "src/renderer/"),
      },
    },
  },
  // pages: {
  //   index: "src/renderer/main.js",
  // },
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src/main/background.js",
      rendererProcessFile: "src/renderer/main.js",
      nodeIntegration: true,
      builderOptions: {
        appId: "com.tesla.processManagement",
        mac: {
          target: ["dmg"],
          icon: "public/tesla-icon.icns",
        },
        win: {
          target: ["nsis"],
          icon: "public/tesla-icon.ico",
        },
        nsis: {
          shortcutName: "${productName}",
          artifactName: "${productName}.${version}.exe",
          installerIcon: "public/tesla-icon.ico",
          uninstallerIcon: "public/tesla-icon.ico",
          uninstallDisplayName: "${productName}.${version}",
          oneClick: true,
          allowToChangeInstallationDirectory: false,
        },
        dmg: {
          title: "${productName}.${version}",
          icon: "public/tesla-icon.icns",
          sign: false,
        },
      },
    },
  },
};
