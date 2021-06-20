const { ipcMain } = require("electron");
const { ForeignKeyConstraintError } = require("sequelize");
const Repo = require("../database/repositories/production");
const MODULE_NAME = "production";

module.exports = async () => {
  //#region Queries
  ipcMain.on(MODULE_NAME + ".findAll", async (event, criteria) => {
    try {
      const context = await Repo.queries.findAll(criteria);
      event.reply(
        MODULE_NAME + ".findAllCompleted",
        context.map((x) => x.toJSON())
      );
    } catch (error) {
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
      event.reply(MODULE_NAME + ".findByPkError", {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + ".getSelectedOrder", async (event) => {
    try {
      const selected = await Repo.queries.getSelectedOrder();
      event.reply(
        MODULE_NAME + ".getSelectedOrderCompleted",
        selected ? selected.toJSON() : null
      );
    } catch (error) {
      event.reply(MODULE_NAME + ".getSelectedOrderError", {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + ".getActiveOrder", async (event) => {
    try {
      const active = await Repo.queries.getActiveOrder();
      event.reply(
        MODULE_NAME + ".getActiveOrderCompleted",
        active ? active.toJSON() : null
      );
    } catch (error) {
      event.reply(MODULE_NAME + ".getActiveOrderError", {
        code: 505,
        message: error.message,
      });
    }
  });

  //#endregion Queries

  //#region Mutations
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
      const context = await Repo.queries.findByPk(payload.id);
      event.reply(MODULE_NAME + ".updateCompleted", context.toJSON());
    } catch (error) {
      event.reply(MODULE_NAME + ".updateError", {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + ".selectOrder", async (event, id) => {
    try {
      await Repo.mutations.selectOrder(id);
      //const context = await Repo.queries.findByPk(id);
      event.reply(MODULE_NAME + ".updateCompleted");
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
  //#endregion Mutations
};
