import { movie } from '../database/db.js';
import { Op } from 'sequelize';
import responseHelper from '../helpers/responseHelper.js';
import { uploadImage } from '../helpers/uploadHelper.js';

const movieController = {
  addMovie: async (req, res) => {
    try {
      const { title, year, genre } = await req.body;
      const file = await req.file;

      if (title && year && genre && file) {
        const result = await uploadImage(file?.path);
        const { public_id, secure_url } = result;

        const newMovie = await movie.create({
          title,
          year,
          genre,
          poster: secure_url,
          posterId: public_id,
        });

        responseHelper(res, 200, newMovie, 'Add Movie Success');
      } else {
        responseHelper(res, 400, null, 'Add Movie Failed');
      }
    } catch (error) {
      console.log(error);
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getMovie: async (req, res) => {
    try {
      const movies = await movie.findAll({});
      responseHelper(res, 200, movies, 'Get Movies Success');
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getMovieByGenre: async (req, res) => {
    try {
      const selectedGenre = await req.params.genre;
      const movies = await movie.findAll({
        attributes: ['title', 'genre'],
        where: {
          genre: selectedGenre.toLowerCase(),
        },
      });

      if (movies.length > 1) {
        responseHelper(res, 200, movies, 'Get Movies By Genre Success');
      } else {
        responseHelper(res, 404, null, 'No movies found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getMovieByYear: async (req, res) => {
    try {
      const selectedYear = Number(req?.params?.year);
      const isBefore = req?.body?.timeClause || 'before';

      const whereClause =
        isBefore === 'before' ? { year: { [Op.lte]: selectedYear } } : { year: { [Op.gte]: selectedYear } };

      const movies = await movie.findAll({
        attributes: ['title', 'year'],
        where: whereClause,
      });

      const statusCode = movies ? 200 : 400;
      const message = movies ? 'Get Movies By Year Success' : 'Get Movies By Year Failed';

      responseHelper(res, statusCode, movies, message);
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getMovieById: async (req, res) => {
    try {
      const selectedMovie = await movie.findByPk(req.params.id);
      if (selectedMovie) {
        responseHelper(res, 200, selectedMovie, 'Get Movie By Id Success');
        return;
      }

      responseHelper(res, 404, null, 'API not found');
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  updateMovie: async (req, res) => {
    try {
      const selectedMovie = await movie.findByPk(req.params.id);
      if (selectedMovie) {
        await selectedMovie.update(req.body);
        responseHelper(res, 200, selectedMovie, 'Update Movie Success');
      } else {
        responseHelper(res, 404, null, 'API not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  deleteMovie: async (req, res) => {
    try {
      const selectedMovie = await movie.findByPk(req.params.id);
      if (selectedMovie) {
        await selectedMovie.destroy();
        responseHelper(res, 200, null, 'Delete Movie Success');
      } else {
        responseHelper(res, 404, null, 'API not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },
};

export default movieController;
