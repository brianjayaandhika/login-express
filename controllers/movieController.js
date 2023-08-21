import { movie } from '../database/db.js';
import { Op } from 'sequelize';
import responseHelper from '../helpers/responseHelper.js';
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
      const { title, year, genre } = req.body;
      const file = req.file;

      if (title && year && genre) {
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
    /**
     * Data: {
     *   Endpoint: '/api/movies/year/:year/:beforeafter',
     *   Method: 'GET',
     *   Description: 'Retrieves a list of movies based on the specified year and filter.'
     * }
     */
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
    /**
     * Data: {
     *   Endpoint: '/api/movies/:id',
     *   Method: 'GET',
     *   Description: 'Retrieves detailed information about a specific movie by its ID.'
     * }
     */
    try {
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
