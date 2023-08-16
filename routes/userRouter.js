import express from 'express';
import userController from '../controllers/userController.js';
import jwtController from '../controllers/jwtController.js';

const userRouter = express.Router();

userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.put('/password', jwtController.verifyToken, userController.changePassword);
userRouter.post('/forgot', userController.forgotPassword);
userRouter.get('/view/:username', jwtController.verifyToken, userController.getProfile);

export default userRouter;
