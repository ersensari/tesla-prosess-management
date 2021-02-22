import jwt from "jsonwebtoken";
import db from "../index";
import crypto from "../../crypto";
const User = db.User;

export default {
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

      const token = jwt.sign(user.toJSON(), process.env.JWT_PRIVATE_KEY);

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
