const { ipcMain } = require("electron");
const { ForeignKeyConstraintError } = require("sequelize");
const Repo = require("../database/repositories/production");
const MODULE_NAME = "production";

module.exports = async () => {
  ipcMain.on(MODULE_NAME + ".findAll", async (event) => {
    try {
      const context = await Repo.queries.findAll();
      event.reply(
        MODULE_NAME + ".findAllCompleted",
        context.map((x) => x.toJSON())
      );
    } catch (error) {
      console.log(error);
      event.reply(MODULE_NAME + ".findAllError", {
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
      console.log(error);
      event.reply(MODULE_NAME + ".findByPkError", {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + ".save", async (event, payload) => {
    try {
      const context = await Repo.mutations.save(payload);
      event.reply(MODULE_NAME + ".saveCompleted", context.dataValues);
    } catch (error) {
      event.reply(MODULE_NAME + ".saveError", {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + ".update", async (event, payload) => {
    try {
      await Repo.mutations.update(payload);
      const context = await Repo.queries.findById(payload.id);
      event.reply(MODULE_NAME + ".updateCompleted", context.toJSON());
    } catch (error) {
      event.reply(MODULE_NAME + ".updateError", {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + ".delete", async (event, id) => {
    try {
      await Repo.mutations.delete(id);
      event.reply(MODULE_NAME + ".deleteCompleted");
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        event.reply(MODULE_NAME + ".deleteError", {
          code: 505,
          message: "Kullanılan Kayıtlar Silinemez!",
        });
      } else {
        event.reply(MODULE_NAME + ".deleteError", {
          code: 505,
          message: error.message,
        });
      }
    }
  });
};
