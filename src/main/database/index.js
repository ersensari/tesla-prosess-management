"use strict";
const { Sequelize, DATE } = require("sequelize");
require("tedious");

const models = require("./models/all");

const env = process.env.NODE_ENV || "development";

const config = require("../config/database.json")[env];

const db = {};

DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format("YYYY-MM-DD HH:mm");
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialectModule: require("tedious"),
  }
);

models.forEach((model) => {
  const m = model(sequelize, Sequelize.DataTypes);
  db[m.name] = m;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
