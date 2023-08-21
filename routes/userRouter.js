import express from 'express';
import userController from '../controllers/userController.js';
import verifyController from '../controllers/verifyController.js';
import jwtController from '../controllers/verifyController.js';

const userRouter = express.Router();
const adminRoute = [verifyController.verifyToken, verifyController.verifyAdmin];

userRouter.post('/register', userController.registerUser);
userRouter.get('/verify/:username', verifyController.verifyEmail);
userRouter.post('/login', userController.loginUser);
userRouter.put('/password', verifyController.verifyToken, userController.changePassword);
userRouter.post('/forgot', userController.forgotPassword);
userRouter.get('/forgot/:username', jwtController.verifyForgotPassword);
userRouter.get('/view/:username', verifyController.verifyToken, userController.getProfile);
userRouter.get('/all-user', adminRoute, userController.getAllUser);
userRouter.put('/role/:username', adminRoute, userController.updateRole);
userRouter.delete('/delete/:username', adminRoute, userController.deleteUser);

export default userRouter;
