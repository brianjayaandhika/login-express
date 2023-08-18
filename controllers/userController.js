import { user } from '../database/db.js';
import responseHelper from '../helpers/responseHelper.js';
import jwt from 'jsonwebtoken';
import { emailSender } from '../services/emailSender.js';

const userController = {
  registerUser: async (req, res) => {
    try {
      req.body.role && responseHelper(res, 403, null, 'Forbidden');

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
          responseHelper(res, 400, null, 'Username or Email already exists!');
        } else {
          const newUser = await user.create(req.body);

          const emailMessage = {
            from: 'sender@server.com',
            to: req.body.email,
            subject: 'Email Verification',
            html: `<p>Click <a href="${process.env.DB_URL}/user/verify/${req.body.username}" target="_blank" rel="noopener noreferrer">here</a>
              to Verify Your Email</p>`,
          };

          emailSender(emailMessage, (err, info) => {
            if (err) {
              console.error(err);
              responseHelper(res, 500, null, 'Failed to send verification email.');
            } else {
              console.log('Email sent:', info.response);
              responseHelper(res, 200, newUser, 'Register Success, Please check your email for verification!');
            }
          });
        }
      } else {
        responseHelper(res, 400, null, 'Register Failed!');
      }
    } catch (error) {
      console.log(error);
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },
  loginUser: async (req, res) => {
    try {
      if (req.body.username && req.body.password) {
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

          if (checkLogin[0].verified) {
            responseHelper(res, 200, loginSession, 'Login Success!');
          } else {
            responseHelper(res, 400, null, 'Email is not verified!');
          }
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
          const updatedUser = await selectedUser.update({ password: req.body.newPassword });
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
      const selectedUser = await user.findOne({ where: { email: req.body.email } });
      const otp = Math.ceil(Math.random() * 1000000 + 1);
      const encryptedOtp = otp * 291831;

      if (selectedUser) {
        const emailMessage = {
          from: 'sender@server.com',
          to: req.body.email,
          subject: 'Forgot Password',
          html: `<p>Click <a href="${process.env.DB_URL}/user/forgot/${selectedUser.username}/${encryptedOtp}" target="_blank" rel="noopener noreferrer">here</a>
          to change your password to ${otp}</p>`,
        };

        emailSender(emailMessage, (err) => {
          if (err) {
            responseHelper(res, 500, null, 'Failed to send forgot password email.');
          } else {
            responseHelper(res, 200, null, 'Check your email to get a new password!');
          }
        });
      } else {
        responseHelper(res, 400, null, 'User not found');
      }
    } catch (error) {
      console.log(error);
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

  getAllUser: async (req, res) => {
    try {
      const allUser = await user.findAll({});

      console.log(allUser);
      responseHelper(res, 200, allUser, 'Get All User Success');
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  updateRole: async (req, res) => {
    try {
      const selectedUser = await user.findByPk(req.params.username);

      if (selectedUser) {
        const updatedUser = await selectedUser.update({ role: req.body.role });
        responseHelper(res, 200, updatedUser, 'Update Role Success');
      } else {
        responseHelper(res, 404, null, 'User not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  deleteUser: async (req, res) => {
    try {
      const selectedUser = await user.findByPk(req.params.username);

      await selectedUser.destroy();
      responseHelper(res, 200, null, 'Delete User Success');
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },
};

export default userController;
