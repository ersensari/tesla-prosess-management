const { ipcMain } = require('electron');
const { ForeignKeyConstraintError } = require('sequelize');
const Repo = require('../database/repositories/user');
const MODULE_NAME = 'users';

module.exports = async () => {
  ipcMain.on(MODULE_NAME + '.findAll', async (event) => {
    try {
      console.log('user list');
      const context = await Repo.queries.findAll();
      event.reply(MODULE_NAME + '.findAllCompleted', context);
    } catch (error) {
      event.reply(MODULE_NAME + '.findAllError', {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + '.save', async (event, payload) => {
    try {
      const context = await Repo.mutations.save(payload);
      event.reply(MODULE_NAME + '.saveCompleted', context.toJSON());
    } catch (error) {
      event.reply(MODULE_NAME + '.saveError', {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + '.update', async (event, payload) => {
    try {
      await Repo.mutations.update(payload);
      event.reply(MODULE_NAME + '.updateCompleted');
    } catch (error) {
      event.reply(MODULE_NAME + '.updateError', {
        code: 505,
        message: error.message,
      });
    }
  });

  ipcMain.on(MODULE_NAME + '.delete', async (event, id) => {
    try {
      await Repo.mutations.delete(id);
      event.reply(MODULE_NAME + '.deleteCompleted');
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        event.reply(MODULE_NAME + '.deleteError', {
          code: 505,
          message: 'Daha önce giriş yapmış kullanıcılar silinemez!',
        });
      } else {
        event.reply(MODULE_NAME + '.deleteError', {
          code: 505,
          message: error.message,
        });
      }
    }
  });
};
