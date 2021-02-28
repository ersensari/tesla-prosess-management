const jwt = require("jsonwebtoken");
const db = require("../index");
const crypto = require("../../crypto");
const User = db.User;
const JWT_PRIVATE_KEY =
  "fad28ae77c37f44dc5cf702fb75d32af8af3c6a814c6ae75d5149cc97b7f0fdb8b1b8518a15fcf09d1e52b9e40e8e3b8d35ca628f26e344399193c32419661f4";
module.exports = {
  queries: {
    findAll: async () => {
      return await User.findAll();
    },
  },
  mutations: {
    save: async (payload) => {
      payload.password = crypto.encrypt(payload.password);
      return await User.create(payload);
    },
    update: async (payload) => {
      return await User.update(payload, { where: { id: payload.id } });
    },
    delete: async (id) => {
      await User.destroy({ where: { id: id } });
    },
  },
  auth: {
    login: async (loginForm) => {
      const incorrectLoginErrorMessage = "Login bilgileriniz hatalı!";
      if (!loginForm || !loginForm.username || !loginForm.password) {
        throw new Error(incorrectLoginErrorMessage);
      }

      const user = await User.findOne({
        where: {
          username: loginForm.username,
          password: crypto.encrypt(loginForm.password),
        },
      });

      if (user === null) {
        throw new Error(incorrectLoginErrorMessage);
      }

      const token = jwt.sign(user.toJSON(), JWT_PRIVATE_KEY);

      return {
        token: crypto.encrypt(token),
        user: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    },
  },
};
