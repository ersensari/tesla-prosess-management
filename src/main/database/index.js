const tedious = require("tedious");
const { Sequelize, DATE } = require("sequelize");

const models = require("./models/all").default;

const db = {};

DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format("YYYY-MM-DD HH:mm:ss.SSS");
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_ADDRESS,
    dialect: "mssql",
    dialectModule: tedious,
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

export default db;
