import jwt from 'jsonwebtoken';
import responseHelpers from '../helpers/responseHelper.js';

const jwtController = {
  verifyToken: (req, res, next) => {
    let tokenHeader = req.headers['access-token'];

    if (tokenHeader.split(' ')[0] !== 'Bearer') {
      return res.status(500).send({
        auth: false,
        message: 'Error',
        errors: 'Incorrect token format',
      });
    }

    let token = tokenHeader.split(' ')[1];

    if (!token) {
      return res.status(403).send({
        auth: false,
        message: 'Error',
        errors: 'No token provided',
      });
    }

    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: 'Error',
          errors: err,
        });
      }
      req.userRole = decoded.role;
      next();
    });
  },

  verifyAdmin: (req, res, next) => {
    if (req.userRole === 'admin') {
      next();
    } else {
      responseHelpers(res, 403, null, 'Forbidden');
    }
  },
};
export default jwtController;
