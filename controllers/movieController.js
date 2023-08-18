import { movie } from '../database/db.js';
import responseHelper from '../helpers/responseHelper.js';
import { Op } from 'sequelize';
import { uploadImage } from '../helpers/uploadHelper.js';

const movieController = {
  addMovie: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/movies',
     *   Method: 'POST',
     *   Request: {
     *     Body: {
     *       "title": "string",
     *       "year": "number",
     *       "genre": "string",
     *       "poster": "file"
     *     }
     *   },
     *   Description: 'Adds a new movie to the database.'
     * }
     */
    try {
      if (req.body.title && req.body.year && req.body.genre) {
        // Untuk menambahkan ke database menggunakan .create()

        const result = await uploadImage(req.file?.path);
        const { public_id, secure_url } = result;

        const newMovie = await movie.create({
          title: req.body.title,
          year: req.body.year,
          genre: req.body.genre,
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
    /**
     * Data: {
     *   Endpoint: '/api/movies',
     *   Method: 'GET',
     *   Description: 'Retrieves a list of all movies.'
     * }
     */
    try {
      const movies = await movie.findAll({});
      responseHelper(res, 200, movies, 'Get Movies Success');
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getMovieByGenre: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/movies/genre/:genre',
     *   Method: 'GET',
     *   Description: 'Retrieves a list of movies based on the specified genre.'
     * }
     */
    try {
      const selectedGenre = await req.params.genre;
      const movies = await movie.findAll({
        attributes: ['title', 'genre'],
        where: {
          genre: selectedGenre.toLocaleLowerCase(),
        },
      });

      if (movies) {
        responseHelper(res, 200, movies, 'Get Movies By Genre Success');
      } else {
        responseHelper(res, 400, movies, 'Get Movies By Genre Failed');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getMovieByYear: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/movies/year/:year/:beforeafter',
     *   Method: 'GET',
     *   Description: 'Retrieves a list of movies based on the specified year and filter.'
     * }
     */
    try {
      const selectedYear = Number(req.params.year);
      const isBefore = req.params.beforeafter === 'before';

      const whereClause = isBefore ? { year: { [Op.lte]: selectedYear } } : { year: { [Op.gte]: selectedYear } };

      const movies = await movie.findAll({
        attributes: ['title', 'year'],
        where: { ...whereClause },
      });

      if (movies) {
        responseHelper(res, 200, movies, 'Get Movies By Year Success');
      } else {
        responseHelper(res, 400, movies, 'Get Movies By Year Failed');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  getMovieById: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/movies/:id',
     *   Method: 'GET',
     *   Description: 'Retrieves detailed information about a specific movie by its ID.'
     * }
     */
    try {
      console.log(req.params.id);
      const selectedMovie = await movie.findByPk(req.params.id);
      if (selectedMovie) {
        responseHelper(res, 200, selectedMovie, 'Get Movie By Id Success');
      } else {
        responseHelper(res, 404, null, 'API not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  updateMovie: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/movies/:id',
     *   Method: 'PUT',
     *   Request: {
     *     Body: {
     *       "title": "string",
     *       "year": "number",
     *       "genre": "string"
     *     }
     *   },
     *   Description: 'Updates information about a specific movie by its ID.'
     * }
     */
    try {
      const selectedMovie = await movie.findByPk(req.params.id);
      if (selectedMovie) {
        const updatedMovie = await selectedMovie.update(req.body);
        responseHelper(res, 200, updatedMovie, 'Update Movie Success');
      } else {
        responseHelper(res, 404, null, 'API not found');
      }
    } catch (error) {
      responseHelper(res, 500, null, 'Internal Server Error');
    }
  },

  deleteMovie: async (req, res) => {
    /**
     * Data: {
     *   Endpoint: '/api/movies/:id',
     *   Method: 'DELETE',
     *   Description: 'Deletes a specific movie from the database by its ID.'
     * }
     */
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
