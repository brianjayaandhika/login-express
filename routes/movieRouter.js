import express from 'express';
import movieController from '../controllers/movieController.js';
import jwtController from '../controllers/jwtController.js';
import upload from '../helpers/multerHelper.js';

const movieRouter = express.Router();
const adminRoute = [jwtController.verifyToken, jwtController.verifyAdmin];

movieRouter.post('/', adminRoute, upload.single('poster'), movieController.addMovie);
movieRouter.get('/', jwtController.verifyToken, movieController.getMovie);
movieRouter.get('/genre/:genre', movieController.getMovieByGenre);
movieRouter.get('/year/:year/:beforeafter', movieController.getMovieByYear);
movieRouter.get('/:id', movieController.getMovieById);
movieRouter.put('/:id', adminRoute, movieController.updateMovie);
movieRouter.delete('/:id', adminRoute, movieController.deleteMovie);

export default movieRouter;
