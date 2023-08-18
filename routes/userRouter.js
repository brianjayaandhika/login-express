import express from 'express';
import userController from '../controllers/userController.js';
import verifyController from '../controllers/verifyController.js';

const userRouter = express.Router();

userRouter.post('/register', userController.registerUser);
userRouter.get('/verify/:username', verifyController.verifyEmail);
userRouter.post('/login', userController.loginUser);
userRouter.put('/password', verifyController.verifyToken, userController.changePassword);
userRouter.post('/forgot', userController.forgotPassword);
userRouter.get('/view/:username', verifyController.verifyToken, userController.getProfile);

export default userRouter;
