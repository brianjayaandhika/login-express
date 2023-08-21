import express from 'express';
import movieController from '../controllers/movieController.js';
import verifyController from '../controllers/verifyController.js';
import upload from '../helpers/multerHelper.js';

const movieRouter = express.Router();
const adminRoute = [verifyController.verifyToken, verifyController.verifyAdmin];

movieRouter.post('/', adminRoute, upload.single('poster'), movieController.addMovie);
movieRouter.get('/', verifyController.verifyToken, movieController.getMovie);
movieRouter.get('/genre/:genre', movieController.getMovieByGenre);
movieRouter.get('/year/:year', movieController.getMovieByYear);
movieRouter.get('/:id', movieController.getMovieById);
movieRouter.put('/:id', adminRoute, movieController.updateMovie);
movieRouter.delete('/:id', adminRoute, movieController.deleteMovie);

export default movieRouter;
