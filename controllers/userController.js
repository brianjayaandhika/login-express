import { user } from '../database/db.js';
import responseHelper from '../helpers/responseHelper.js';
import { emailSender } from '../services/emailSender.js';
import { generateAuthToken } from '../services/generateToken.js';

const userController = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        responseHelper(res, 400, null, 'Register Failed!');
        return;
      }

      const duplicateUsername = await user.findAll({
        where: {
          username,
        },
      });

      const duplicateEmail = await user.findAll({
        where: {
          email,
        },
      });

      if (duplicateUsername.length > 0 || duplicateEmail.length > 0) {
        responseHelper(res, 400, null, 'Username or Email already exists!');
        return;
      }

      const newUser = await user.create(req.body);

      const emailMessage = {
        from: 'sender@server.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${process.env.DB_URL}/user/verify/${username}" target="_blank" rel="noopener noreferrer">here</a>
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
    } catch (error) {
      console.log(error);
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  loginUser: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/login',
     *   Method: 'POST',
     *   Request: {
     *     Body: {
     *       "username": "string",
     *       "password": "string"
     *     }
     *   },
     *   Description: 'Logs in a user and generates an authentication token.'
     * }
     */
    try {
      const { username, password } = req.body;

      if (username && password) {
        const checkLogin = await user.findAll({
          where: {
            username,
            password,
          },
        });

        if (checkLogin.length > 0) {
          const token = generateAuthToken(username, checkLogin[0].role);

          const loginSession = {
            username,
            role: checkLogin[0].role,
            token,
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
    /**
     * Data: {
     *   Endpoint: '/api/change-password',
     *   Method: 'PUT',
     *   Request: {
     *     Body: {
     *       "username": "string",
     *       "oldPassword": "string",
     *       "newPassword": "string"
     *     }
     *   },
     *   Description: 'Changes the user's password if the old password matches.'
     * }
     */
    try {
      const { username, oldPassword, newPassword } = req.body;
      const selectedUser = await user.findByPk(username);

      if (!selectedUser) {
        responseHelper(res, 400, null, 'User not found');
        return;
      }

      if (selectedUser.password !== oldPassword) {
        responseHelper(res, 400, null, 'Old Password is wrong!');
        return;
      }

      const updatedUser = await selectedUser.update({ password: newPassword });
      responseHelper(res, 200, updatedUser, 'Change Password Success');
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  forgotPassword: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/forgot-password',
     *   Method: 'POST',
     *   Request: {
     *     Body: {
     *       "email": "string"
     *     }
     *   },
     *   Description: 'Sends a password reset email to the user's email address.'
     * }
     */
    try {
      const { email } = req.body;
      const selectedUser = await user.findOne({ where: { email } });

      if (selectedUser) {
        const otp = Math.ceil(Math.random() * 1000000 + 1);
        const encryptedOtp = otp * 291831;
        const resetPasswordUrl = `${process.env.DB_URL}/user/forgot/${selectedUser.username}/${encryptedOtp}`;
        const emailMessage = {
          from: 'sender@server.com',
          to: email,
          subject: 'Forgot Password',
          html: `<p>Click <a href="${resetPasswordUrl}" target="_blank" rel="noopener noreferrer">here</a>
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
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getProfile: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/profile/:username',
     *   Method: 'GET',
     *   Description: 'Retrieves the profile information of a specific user.'
     * }
     */
    try {
      const selectedUser = await user.findByPk(req.params.username);

      if (selectedUser) {
        const data = {
          username: selectedUser.username,
          email: selectedUser.email,
          role: selectedUser.role,
          verified: selectedUser.verified,
        };

        responseHelper(res, 200, data, 'Get Profile Success');
      } else {
        responseHelper(res, 404, null, 'User not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getAllUser: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/users',
     *   Method: 'GET',
     *   Description: 'Retrieves a list of all registered users. (Admin access required)'
     * }
     */
    try {
      const allUser = await user.findAll({
        attributes: ['username', 'role', 'email', 'verified'],
      });
      responseHelper(res, 200, allUser, 'Get All User Success');
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  updateRole: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/users/:username/role',
     *   Method: 'PUT',
     *   Request: {
     *     Body: {
     *       "role": "string"
     *     }
     *   },
     *   Description: 'Updates the role of a specific user. (Admin access required)'
     * }
     */
    try {
      const { username } = req.params;
      const { role } = req.body;

      const selectedUser = await user.findByPk(username);

      if (selectedUser) {
        const updatedUser = await selectedUser.update({ role });
        responseHelper(res, 200, updatedUser, 'Update Role Success');
      } else {
        responseHelper(res, 404, null, 'User not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  deleteUser: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/users/:username',
     *   Method: 'DELETE',
     *   Description: 'Deletes a user from the system. (Admin access required)'
     * }
     */
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
