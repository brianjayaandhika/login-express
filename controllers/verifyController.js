import jwt from 'jsonwebtoken';
import responseHelper from '../helpers/responseHelper.js';
import { user } from '../database/db.js';

const jwtController = {
  verifyToken: (req, res, next) => {
    let tokenHeader = req.headers['access-token'];

    if (!tokenHeader) {
      responseHelper(res, 404, null, 'Token not provided');
    }

    let token = tokenHeader.split(' ')[1];

    if (tokenHeader.split(' ')[0] !== 'Bearer') {
      responseHelper(res, 400, null, 'Incorrect token format');
    }

    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        responseHelper(res, 403, null, 'Forbidden');
      }
      req.userRole = decoded.role;
      next();
    });
  },

  verifyAdmin: (req, res, next) => {
    if (req.userRole === 'admin') {
      next();
    } else {
      responseHelper(res, 403, null, 'Forbidden');
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const selectedUser = await user.findByPk(req.params.username);

      if (selectedUser) {
        if (selectedUser.verified) {
          responseHelper(res, 400, null, 'Email is already verified');
        } else {
          selectedUser.update({ verified: true });
          responseHelper(res, 200, null, 'Email Has Been Verified');
        }
      } else {
        responseHelper(res, 404, null, 'User not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },
};
export default jwtController;
