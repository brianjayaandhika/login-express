import express from 'express';
import movieController from '../controllers/movieController.js';

const movieRouter = express.Router();

movieRouter.post('/', movieController.addMovie);
movieRouter.get('/', movieController.getMovie);
movieRouter.get('/genre/:genre', movieController.getMovieByGenre);
movieRouter.get('/year/:year/:beforeafter', movieController.getMovieByYear);
movieRouter.get('/:id', movieController.getMovieById);
movieRouter.put('/:id', movieController.updateMovie);
movieRouter.delete('/:id', movieController.deleteMovie);

export default movieRouter;
