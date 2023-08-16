import { user } from '../database/db.js';
import responseHelper from '../helpers/responseHelper.js';
import jwt from 'jsonwebtoken';

const userController = {
  registerUser: async (req, res) => {
    try {
      if (req.body.username && req.body.email && req.body.password) {
        const duplicateUsername = await user.findAll({
          where: {
            username: req.body.username,
          },
        });
        const duplicateEmail = await user.findAll({
          where: {
            email: req.body.email,
          },
        });

        if (duplicateUsername.length > 0 || duplicateEmail.length > 0) {
          responseHelper(res, 400, null, 'Username already exists!');
        } else {
          const newUser = await user.create(req.body);

          responseHelper(res, 200, newUser, 'Register Success!');
        }
      } else {
        responseHelper(res, 400, null, 'Register Failed!');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },
  loginUser: async (req, res) => {
    try {
      if (req.body.username && req.body.password) {
        // Untuk menambahkan ke database menggunakan .create()
        const checkLogin = await user.findAll({
          where: {
            username: req.body.username,
            password: req.body.password,
          },
        });

        if (checkLogin.length > 0) {
          const token =
            'Bearer ' +
            jwt.sign(
              {
                username: req.body.username,
                role: checkLogin[0].role,
              },
              'secret',
              {
                expiresIn: '2h',
              }
            );

          const loginSession = {
            username: req.body.username,
            role: checkLogin[0].role,
            token: token,
          };
          responseHelper(res, 200, loginSession, 'Login Success!');
        } else {
          responseHelper(res, 400, null, 'Login Failed!');
        }
      } else {
        responseHelper(res, 400, null, 'Need username and password to login!');
      }
    } catch (error) {
      console.log(error);
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  changePassword: async (req, res) => {
    try {
      const selectedUser = await user.findByPk(req.body.username);
      const oldPassword = selectedUser.password;

      if (selectedUser) {
        if (oldPassword === req.body.oldPassword) {
          const updatedUser = await selectedUser.update(req.body);
          responseHelper(res, 200, updatedUser, 'Change Password Success');
        } else {
          responseHelper(res, 400, null, 'Old Password is wrong!');
        }
      } else {
        responseHelper(res, 400, null, 'User not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const selectedUser = await user.findByPk(req.body.username);
      const otp = Math.ceil(Math.random() * 1000000);

      if (selectedUser) {
        const updatedUser = await selectedUser.update({ password: otp });
        responseHelper(res, 200, updatedUser, 'Password has changed');
      } else {
        responseHelper(res, 400, null, 'User not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getProfile: async (req, res) => {
    try {
      const selectedUser = await user.findByPk(req.params.username);

      if (selectedUser) {
        responseHelper(res, 200, selectedUser, 'Get Profile Success');
      } else {
        responseHelper(res, 404, null, 'User not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },
};

export default userController;
